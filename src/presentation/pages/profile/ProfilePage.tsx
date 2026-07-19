import { useEffect, useState } from 'react'

import type { Address } from '@/domain/entities/address.entity'
import type { Customer } from '@/domain/entities/customer.entity'
import type { Document } from '@/domain/entities/document.entity'
import type { UserProfile } from '@/domain/entities/user-profile.entity'
import { ApiException } from '@/domain/exceptions/api.exception'

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
  const [addressProvince, setAddressProvince] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressSecondary, setAddressSecondary] = useState('')
  const [addressPostalCode, setAddressPostalCode] = useState('')
  const [addressReference, setAddressReference] = useState('')
  const [savingAddress, setSavingAddress] = useState(false)
  const [addressFeedback, setAddressFeedback] = useState('')
  const [profileFeedback, setProfileFeedback] = useState('')
  const [profileError, setProfileError] = useState('')

  const [documentType, setDocumentType] = useState('CEDULA')
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentFileUrl, setDocumentFileUrl] = useState('')
  const [documentIssueDate, setDocumentIssueDate] = useState('')
  const [documentExpiryDate, setDocumentExpiryDate] = useState('')
  const [savingDocument, setSavingDocument] = useState(false)
  const [documentFeedback, setDocumentFeedback] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const profileData = await authUseCase.getProfile()
        const customerData = await customerUseCase.getCustomer(
          profileData.id,
        )

        const [addressData, documentData] = await Promise.all([
          customerUseCase.getAddresses(customerData?.id),
          customerUseCase.getDocuments(customerData?.id),
        ])

        setProfile(profileData)
        localUserStorage.saveUser(profileData)
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

    setProfileFeedback('')
    setProfileError('')

    try {
      const requestedEmail = profileData.email?.trim() ?? ''
      const requestedAltEmail = customerData.correo_alternativo?.trim() ?? ''
      const profilePayload: Partial<UserProfile> = {
        username: profileData.username?.trim(),
        email: profileData.email?.trim(),
        telefono: profileData.telefono ?? null,
      }

      const updatedProfile = await authUseCase.updateProfile(profilePayload)

      setProfile(updatedProfile)
      localUserStorage.saveUser(updatedProfile)

      // first_name / last_name are optional by API contract in this backend.
      if (profileData.first_name?.trim() || profileData.last_name?.trim()) {
        try {
          const updatedProfileWithNames = await authUseCase.updateProfile({
            first_name: profileData.first_name?.trim(),
            last_name: profileData.last_name?.trim(),
          })

          setProfile(updatedProfileWithNames)
          localUserStorage.saveUser(updatedProfileWithNames)
        } catch {
          setProfileFeedback(
            'Perfil guardado. Nombre y apellido no se actualizaron porque esta API no los soporta en /perfil/.',
          )
        }
      }

      const requiredCustomerFieldsCompleted =
        Boolean(customerData.cedula?.trim())
        && Boolean(customerData.nombres?.trim())
        && Boolean(customerData.apellidos?.trim())
        && Boolean(customerData.nacionalidad?.trim())

      const customerPatch: Partial<Customer> = {}

      if (customerData.cedula?.trim()) {
        customerPatch.cedula = customerData.cedula.trim()
      }

      if (customerData.nombres?.trim()) {
        customerPatch.nombres = customerData.nombres.trim()
      }

      if (customerData.apellidos?.trim()) {
        customerPatch.apellidos = customerData.apellidos.trim()
      }

      if (customerData.nacionalidad?.trim()) {
        customerPatch.nacionalidad = customerData.nacionalidad.trim()
      }

      if (customerData.fecha_nacimiento !== undefined) {
        customerPatch.fecha_nacimiento = customerData.fecha_nacimiento
      }

      if (customerData.genero !== undefined) {
        customerPatch.genero = customerData.genero
      }

      if (customerData.correo_alternativo !== undefined) {
        customerPatch.correo_alternativo = customerData.correo_alternativo
      }

      if (customer?.id) {
        if (Object.keys(customerPatch).length > 0) {
          await customerUseCase.updateCustomer(
            customer.id,
            customerPatch,
          )
        }
      } else {
        if (!requiredCustomerFieldsCompleted) {
          setEditing(false)
          setProfileFeedback(
            'Perfil guardado. Para crear el cliente completa cédula, nombres, apellidos y nacionalidad.',
          )
          return
        }

        await customerUseCase.createCustomer({
          perfil: updatedProfile.id,
          cedula: customerData.cedula!,
          nombres: customerData.nombres!,
          apellidos: customerData.apellidos!,
          fecha_nacimiento: customerData.fecha_nacimiento ?? null,
          genero: customerData.genero ?? null,
          nacionalidad: customerData.nacionalidad!,
          correo_alternativo: customerData.correo_alternativo ?? null,
        })
      }

      const latestProfile = await authUseCase.getProfile()
      const refreshedCustomer = await customerUseCase.getCustomer(
        latestProfile.id,
      )

      setProfile(latestProfile)
      localUserStorage.saveUser(latestProfile)
      setCustomer(refreshedCustomer)

      const persistedEmail = latestProfile.email?.trim() ?? ''
      const persistedAltEmail = refreshedCustomer?.correo_alternativo?.trim() ?? ''
      const emailMismatch = requestedEmail && persistedEmail !== requestedEmail
      const altEmailMismatch =
        requestedAltEmail && persistedAltEmail !== requestedAltEmail

      if (
        emailMismatch || altEmailMismatch
      ) {
        const messages: string[] = []

        if (emailMismatch) {
          messages.push(
            `Correo principal: enviaste "${requestedEmail}" y backend devolvio "${persistedEmail || 'vacio'}".`,
          )
        }

        if (altEmailMismatch) {
          messages.push(
            `Correo alternativo: enviaste "${requestedAltEmail}" y backend devolvio "${persistedAltEmail || 'vacio'}".`,
          )
        }

        setProfileError(
          `No se persistieron todos los cambios. ${messages.join(' ')}`,
        )
        setProfileFeedback('')
        setEditing(true)
        return
      }

      setEditing(false)
      if (!profileFeedback) {
        setProfileFeedback('Perfil y datos del cliente guardados correctamente.')
      }
    } catch (error: unknown) {
      if (error instanceof ApiException) {
        const fieldErrors = error.fieldErrors
          ? Object.entries(error.fieldErrors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join(' | ')
          : ''

        setProfileError(
          fieldErrors
            ? `${error.message} (${fieldErrors})`
            : error.message,
        )
      } else {
        setProfileError('No se pudieron guardar los cambios del perfil.')
      }
    }
  }

  async function handleCreateAddress() {
    if (!customer?.id) {
      setAddressFeedback('Primero completa y guarda los datos del cliente.')
      return
    }

    if (
      !addressLine.trim()
      || !addressProvince.trim()
      || !addressCity.trim()
    ) {
      setAddressFeedback(
        'Completa calle principal, provincia y ciudad para guardar la dirección.',
      )
      return
    }

    try {
      setSavingAddress(true)
      setAddressFeedback('')

      const createdAddress =
        await customerUseCase.createAddress({
          cliente: customer.id,
          provincia: addressProvince.trim(),
          ciudad: addressCity.trim(),
          calle_principal: addressLine.trim(),
          calle_secundaria: addressSecondary.trim() || null,
          referencia: addressReference.trim() || null,
          codigo_postal: addressPostalCode.trim() || null,
          es_principal: addresses.length === 0,
        })

      setAddresses((current) => [
        createdAddress,
        ...current,
      ])
      setAddressLine('')
      setAddressProvince('')
      setAddressCity('')
      setAddressSecondary('')
      setAddressPostalCode('')
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
      setDocumentFeedback('Primero completa y guarda los datos del cliente.')
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
          cliente: customer.id,
          tipo_documento: documentType.trim(),
          numero_documento: documentNumber.trim(),
          archivo_url: documentFileUrl.trim() || null,
          fecha_emision: documentIssueDate.trim() || null,
          fecha_expiracion: documentExpiryDate.trim() || null,
          verificado: false,
        })

      setDocuments((current) => [
        createdDocument,
        ...current,
      ])
      setDocumentType('CEDULA')
      setDocumentNumber('')
      setDocumentFileUrl('')
      setDocumentIssueDate('')
      setDocumentExpiryDate('')
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

      {editing && profile && (
        <EditProfileForm
          profile={profile}
          customer={customer}
          onSubmit={handleSaveProfile}
          onCancel={() => setEditing(false)}
        />
      )}

      {profileFeedback && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {profileFeedback}
        </p>
      )}

      {profileError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {profileError}
        </p>
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
            <b>Cédula:</b> {customer?.cedula ?? 'Sin definir'}
          </p>

          <p>
            <b>Nombres:</b> {customer?.nombres}
          </p>

          <p>
            <b>Apellidos:</b> {customer?.apellidos}
          </p>

          <p>
            <b>Nacionalidad:</b> {customer?.nacionalidad ?? 'Sin definir'}
          </p>

          <p>
            <b>Género:</b> {customer?.genero ?? 'Sin definir'}
          </p>

          <p>
            <b>Fecha nacimiento:</b>{' '}
            {customer?.fecha_nacimiento ?? 'Sin definir'}
          </p>

          <p>
            <b>Correo alternativo:</b>{' '}
            {customer?.correo_alternativo ?? 'Sin definir'}
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
                  Calle principal
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
                <Label htmlFor="address_province">
                  Provincia
                </Label>

                <Input
                  id="address_province"
                  placeholder="Bolívar"
                  value={addressProvince}
                  onChange={(event) =>
                    setAddressProvince(event.target.value)
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
                <Label htmlFor="address_secondary">
                  Calle secundaria (opcional)
                </Label>

                <Input
                  id="address_secondary"
                  placeholder="Carrera 10"
                  value={addressSecondary}
                  onChange={(event) =>
                    setAddressSecondary(event.target.value)
                  }
                  disabled={savingAddress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_postal_code">
                  Código postal (opcional)
                </Label>

                <Input
                  id="address_postal_code"
                  placeholder="130001"
                  value={addressPostalCode}
                  onChange={(event) =>
                    setAddressPostalCode(event.target.value)
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
                <p>{address.calle_principal}</p>

                {address.calle_secundaria && (
                  <p>{address.calle_secundaria}</p>
                )}

                <p>
                  {address.ciudad}
                  {address.provincia ? `, ${address.provincia}` : ''}
                </p>

                {address.referencia && (
                  <p>
                    Referencia: {address.referencia}
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
                <Label htmlFor="document_file_url">
                  URL de archivo (opcional)
                </Label>

                <Input
                  id="document_file_url"
                  placeholder="https://..."
                  value={documentFileUrl}
                  onChange={(event) =>
                    setDocumentFileUrl(event.target.value)
                  }
                  disabled={savingDocument}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_issue_date">
                  Fecha emisión (opcional)
                </Label>

                <Input
                  id="document_issue_date"
                  type="date"
                  value={documentIssueDate}
                  onChange={(event) =>
                    setDocumentIssueDate(event.target.value)
                  }
                  disabled={savingDocument}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_expiry_date">
                  Fecha expiración (opcional)
                </Label>

                <Input
                  id="document_expiry_date"
                  type="date"
                  value={documentExpiryDate}
                  onChange={(event) =>
                    setDocumentExpiryDate(event.target.value)
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
                  Tipo: {document.tipo_documento}
                </p>

                <p>
                  Número: {document.numero_documento}
                </p>

                {document.archivo_url && (
                  <p>
                    Archivo: {document.archivo_url}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  )
}