import { useEffect, useState } from 'react'

import type { Address } from '@/domain/entities/address.entity'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'

import EditProfileForm from '@/presentation/components/profile/EditProfileForm'
import { ProfileImageUpload } from '@/presentation/components/profile/ProfileImageUpload'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { customerUseCase } from '@/infrastructure/factories/customer.factory'
import { localUserStorage } from '@/infrastructure/storage/local-user-storage'

import { Loader } from '@/presentation/components/common/Loader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'

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

  const [addressLine, setAddressLine] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressCountry, setAddressCountry] = useState('')
  const [addressReference, setAddressReference] = useState('')
  const [savingAddress, setSavingAddress] = useState(false)
  const [addressFeedback, setAddressFeedback] = useState('')

  const [documentType, setDocumentType] = useState('CEDULA')
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentFile, setDocumentFile] = useState('')
  const [savingDocument, setSavingDocument] = useState(false)
  const [documentFeedback, setDocumentFeedback] = useState('')

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

    const updatedProfile = await authUseCase.updateProfile(
      profileData,
    )

    setProfile(updatedProfile)
    localUserStorage.saveUser(updatedProfile)

    if (customer?.id) {
      const updatedCustomer =
        await customerUseCase.updateCustomer(
          customer.id,
          customerData,
        )

      setCustomer(updatedCustomer)
    }

    setEditing(false)
  }

  async function handleCreateAddress() {
    if (!customer?.id) {
      return
    }

    if (
      !addressLine.trim()
      || !addressCity.trim()
      || !addressCountry.trim()
    ) {
      setAddressFeedback(
        'Completa línea, ciudad y país para guardar la dirección.',
      )
      return
    }

    try {
      setSavingAddress(true)
      setAddressFeedback('')

      const createdAddress =
        await customerUseCase.createAddress({
          customer: customer.id,
          address_line: addressLine.trim(),
          city: addressCity.trim(),
          country: addressCountry.trim(),
          reference: addressReference.trim() || undefined,
          is_primary: addresses.length === 0,
        })

      setAddresses((current) => [
        createdAddress,
        ...current,
      ])
      setAddressLine('')
      setAddressCity('')
      setAddressCountry('')
      setAddressReference('')
      setAddressFeedback(
        'Dirección guardada correctamente.',
      )
    } catch {
      setAddressFeedback(
        'No se pudo guardar la dirección. Intenta nuevamente.',
      )
    } finally {
      setSavingAddress(false)
    }
  }

  async function handleCreateDocument() {
    if (!customer?.id) {
      return
    }

    if (
      !documentType.trim()
      || !documentNumber.trim()
    ) {
      setDocumentFeedback(
        'Completa tipo y número para guardar el documento.',
      )
      return
    }

    try {
      setSavingDocument(true)
      setDocumentFeedback('')

      const createdDocument =
        await customerUseCase.createDocument({
          customer: customer.id,
          document_type: documentType.trim(),
          document_number: documentNumber.trim(),
          file: documentFile.trim() || undefined,
        })

      setDocuments((current) => [
        createdDocument,
        ...current,
      ])
      setDocumentType('CEDULA')
      setDocumentNumber('')
      setDocumentFile('')
      setDocumentFeedback(
        'Documento guardado correctamente.',
      )
    } catch {
      setDocumentFeedback(
        'No se pudo guardar el documento. Intenta nuevamente.',
      )
    } finally {
      setSavingDocument(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-background p-5 sm:p-6">
        <h1 className="text-3xl font-bold">
          Mi Perfil
        </h1>

        <Button
          className="mt-3"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancelar' : 'Editar perfil'}
        </Button>

        <p className="mt-2 text-muted-foreground">
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

        <CardContent className="space-y-4">
          <ProfileImageUpload
            currentImage={profile?.foto_url}
            onSuccess={(updatedProfile) => {
              setProfile(updatedProfile)
              localUserStorage.saveUser(updatedProfile)
            }}
          />

          <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
            <p>
              <b>Usuario:</b> {profile?.username}
            </p>

            <p>
              <b>Nombre:</b>{' '}
              {profile?.first_name}{' '}
              {profile?.last_name}
            </p>

            <p>
              <b>Correo:</b> {profile?.email}
            </p>

            <p>
              <b>Rol:</b>{' '}
              {profile?.rol ?? 'CLIENTE'}
            </p>
          </div>
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
            <b>Nacionalidad:</b>{' '}
            {customer?.nacionalidad}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Direcciones
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold">
              Nueva dirección
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address_line">
                  Dirección
                </Label>

                <Input
                  id="address_line"
                  placeholder="Calle 12 # 45-67"
                  value={addressLine}
                  onChange={(event) =>
                    setAddressLine(event.target.value)
                  }
                  disabled={savingAddress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_city">
                  Ciudad
                </Label>

                <Input
                  id="address_city"
                  placeholder="Cartagena"
                  value={addressCity}
                  onChange={(event) =>
                    setAddressCity(event.target.value)
                  }
                  disabled={savingAddress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_country">
                  País
                </Label>

                <Input
                  id="address_country"
                  placeholder="Colombia"
                  value={addressCountry}
                  onChange={(event) =>
                    setAddressCountry(event.target.value)
                  }
                  disabled={savingAddress}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address_reference">
                  Referencia (opcional)
                </Label>

                <Input
                  id="address_reference"
                  placeholder="Apartamento 402"
                  value={addressReference}
                  onChange={(event) =>
                    setAddressReference(event.target.value)
                  }
                  disabled={savingAddress}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCreateAddress}
                disabled={savingAddress}
              >
                {savingAddress
                  ? 'Guardando...'
                  : 'Agregar dirección'}
              </Button>

              {addressFeedback && (
                <p className="text-sm text-muted-foreground">
                  {addressFeedback}
                </p>
              )}
            </div>
          </div>

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

        <CardContent className="space-y-5">
          <div className="rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold">
              Nuevo documento
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="document_type">
                  Tipo
                </Label>

                <select
                  id="document_type"
                  value={documentType}
                  onChange={(event) =>
                    setDocumentType(event.target.value)
                  }
                  disabled={savingDocument}
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="CEDULA">
                    Cédula
                  </option>

                  <option value="PASAPORTE">
                    Pasaporte
                  </option>

                  <option value="LICENCIA">
                    Licencia
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_number">
                  Número
                </Label>

                <Input
                  id="document_number"
                  placeholder="123456789"
                  value={documentNumber}
                  onChange={(event) =>
                    setDocumentNumber(event.target.value)
                  }
                  disabled={savingDocument}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="document_file">
                  URL de archivo (opcional)
                </Label>

                <Input
                  id="document_file"
                  placeholder="https://..."
                  value={documentFile}
                  onChange={(event) =>
                    setDocumentFile(event.target.value)
                  }
                  disabled={savingDocument}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCreateDocument}
                disabled={savingDocument}
              >
                {savingDocument
                  ? 'Guardando...'
                  : 'Agregar documento'}
              </Button>

              {documentFeedback && (
                <p className="text-sm text-muted-foreground">
                  {documentFeedback}
                </p>
              )}
            </div>
          </div>

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