import { useEffect, useState } from 'react'

import type { Address } from '@/domain/entities/address.entity'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

import EditProfileForm from '@/presentation/components/profile/EditProfileForm'
import { ProfileImageUpload } from '@/presentation/components/profile/ProfileImageUpload'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { customerUseCase } from '@/infrastructure/factories/customer.factory'

import { Loader } from '@/presentation/components/common/Loader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null)

  const [customer, setCustomer] =
    useState<Customer | null>(null)

  const [addresses, setAddresses] =
    useState<Address[]>([])

  const [documents, setDocuments] =
    useState<Document[]>([])

  const [loading, setLoading] =
    useState(true)

  const [editing, setEditing] =
    useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [
          profileData,
          customerData,
          addressData,
          documentData,
        ] = await Promise.all([
          authUseCase.getProfile(),
          customerUseCase.getCustomer(),
          customerUseCase.getAddresses(),
          customerUseCase.getDocuments(),
        ])

        setProfile(profileData)
        setCustomer(customerData)
        setAddresses(addressData)
        setDocuments(documentData)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleSaveProfile(
    profileData: Partial<UserProfile>,
    customerData: Partial<Customer>,
  ) {
    if (!profile) {
      return
    }

    await authUseCase.updateProfile(profileData)

    if (customer?.id) {
      await customerUseCase.updateCustomer(
        customer.id,
        customerData,
      )
    }

    setEditing(false)
    window.location.reload()
  }

  if (loading) {
    return <Loader />
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Mi Perfil
        </h1>

        <button
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-white"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancelar' : 'Editar perfil'}
        </button>

        <p className="text-muted-foreground">
          Información de tu cuenta y datos personales
        </p>
      </div>

      {editing && profile && customer && (
        <EditProfileForm
          profile={profile}
          customer={customer}
          onSubmit={handleSaveProfile}
          onCancel={() => setEditing(false)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Información de usuario
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <ProfileImageUpload
            currentImage={profile?.foto_url}
            onSuccess={() => {
              window.location.reload()
            }}
          />

          <p>
            <b>Usuario:</b> {profile?.username}
          </p>

          <p>
            <b>Nombre:</b> {profile?.first_name} {profile?.last_name}
          </p>

          <p>
            <b>Correo:</b> {profile?.email}
          </p>

          <p>
            <b>Rol:</b> {profile?.rol ?? 'CLIENTE'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Datos del cliente
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>
            <b>Cédula:</b> {customer?.cedula}
          </p>

          <p>
            <b>Nombres:</b> {customer?.nombres}
          </p>

          <p>
            <b>Apellidos:</b> {customer?.apellidos}
          </p>

          <p>
            <b>Nacionalidad:</b> {customer?.nacionalidad}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Direcciones
          </CardTitle>
        </CardHeader>

        <CardContent>
          {addresses.length === 0 ? (
            <p className="text-muted-foreground">
              No tienes direcciones registradas.
            </p>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="border-b py-3"
              >
                <p>{address.address_line}</p>

                <p>
                  {address.city}, {address.country}
                </p>

                {address.reference && (
                  <p>
                    Referencia: {address.reference}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Documentos
          </CardTitle>
        </CardHeader>

        <CardContent>
          {documents.length === 0 ? (
            <p className="text-muted-foreground">
              No tienes documentos registrados.
            </p>
          ) : (
            documents.map((document) => (
              <div
                key={document.id}
                className="border-b py-3"
              >
                <p>
                  Tipo: {document.document_type}
                </p>

                <p>
                  Número: {document.document_number}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  )
}
