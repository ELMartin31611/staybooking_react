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
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card p-8 shadow-sm sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-fuchsia-400" />
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/8 blur-3xl dark:bg-primary/12" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-64 rounded-full bg-violet-400/8 blur-3xl dark:bg-violet-500/12" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Mi Perfil
            </h1>
            <p className="mt-2 max-w-md text-sm font-medium text-muted-foreground">
              Gestiona los datos de tu cuenta, direcciones y documentos de identidad.
            </p>
          </div>

          <Button
            className="rounded-xl bg-primary px-5 h-11 font-bold text-primary-foreground shadow-md shadow-primary/25 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancelar edición' : '✏️ Editar perfil'}
          </Button>
        </div>
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
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:bg-emerald-950/20 dark:border-emerald-900/30">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
            {profileFeedback}
          </p>
        </div>
      )}

      {profileError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:bg-rose-950/20 dark:border-rose-900/30">
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-400">
            {profileError}
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-border">
            <CardTitle className="text-xl font-bold text-foreground">
              Información de usuario
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <ProfileImageUpload
              currentImage={profile?.foto_url}
              onSuccess={(updatedProfile) => {
                setProfile(updatedProfile)
                localUserStorage.saveUser(updatedProfile)
              }}
            />

            <div className="grid gap-4 rounded-2xl border border-border bg-muted/40 p-5 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Usuario</p>
                <p className="text-sm font-bold text-foreground">{profile?.username}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nombre completo</p>
                <p className="text-sm font-bold text-foreground">{profile?.first_name} {profile?.last_name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Correo principal</p>
                <p className="text-sm font-bold text-foreground break-all">{profile?.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rol asignado</p>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary uppercase tracking-wider w-fit">
                  {profile?.rol ?? 'CLIENTE'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-border">
            <CardTitle className="text-xl font-bold text-foreground">
              Datos del cliente
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4.5">
              <ProfileDataItem label="Cédula / ID" value={customer?.cedula} />
              <ProfileDataItem label="Nombres" value={customer?.nombres} />
              <ProfileDataItem label="Apellidos" value={customer?.apellidos} />
              <ProfileDataItem label="Nacionalidad" value={customer?.nacionalidad} />
              <ProfileDataItem label="Género" value={customer?.genero} />
              <ProfileDataItem label="Fecha nacimiento" value={customer?.fecha_nacimiento} />
              <ProfileDataItem label="Correo alternativo" value={customer?.correo_alternativo} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">
            Direcciones de entrega / facturación
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/40 p-5">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Nueva dirección
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address_line" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_province" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Provincia
                </Label>

                <Input
                  id="address_province"
                  placeholder="Guayas"
                  value={addressProvince}
                  onChange={(event) =>
                    setAddressProvince(event.target.value)
                  }
                  disabled={savingAddress}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_city" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Ciudad
                </Label>

                <Input
                  id="address_city"
                  placeholder="Guayaquil"
                  value={addressCity}
                  onChange={(event) =>
                    setAddressCity(event.target.value)
                  }
                  disabled={savingAddress}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_secondary" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Calle secundaria (opcional)
                </Label>

                <Input
                  id="address_secondary"
                  placeholder="Av. Principal"
                  value={addressSecondary}
                  onChange={(event) =>
                    setAddressSecondary(event.target.value)
                  }
                  disabled={savingAddress}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_postal_code" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Código postal (opcional)
                </Label>

                <Input
                  id="address_postal_code"
                  placeholder="090101"
                  value={addressPostalCode}
                  onChange={(event) =>
                    setAddressPostalCode(event.target.value)
                  }
                  disabled={savingAddress}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address_reference" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Referencia (opcional)
                </Label>

                <Input
                  id="address_reference"
                  placeholder="Frente al parque central"
                  value={addressReference}
                  onChange={(event) =>
                    setAddressReference(event.target.value)
                  }
                  disabled={savingAddress}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCreateAddress}
                disabled={savingAddress}
                className="rounded-xl bg-primary hover:opacity-90 font-bold h-10 px-5 text-primary-foreground shadow-md shadow-primary/20 active:scale-95 transition-all cursor-pointer"
              >
                {savingAddress ? 'Guardando...' : 'Agregar dirección'}
              </Button>

              {addressFeedback && (
                <p className="text-xs font-semibold text-slate-500">
                  {addressFeedback}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Direcciones registradas
            </h3>

            {addresses.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-center text-sm font-semibold text-muted-foreground">
                No tienes direcciones registradas.
              </p>
            ) : (
              <div className="grid gap-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="text-sm font-bold text-foreground">{address.calle_principal}</p>

                    {address.calle_secundaria && (
                      <p className="mt-0.5 text-xs text-muted-foreground">Secundaria: {address.calle_secundaria}</p>
                    )}

                    <p className="mt-2 text-xs font-semibold text-muted-foreground">
                      📍 {address.ciudad}{address.provincia ? `, ${address.provincia}` : ''}
                    </p>

                    {address.referencia && (
                      <p className="mt-1.5 border-t border-border pt-1.5 text-xs italic text-muted-foreground">
                        Ref: {address.referencia}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">
            Documentos de identidad
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/40 p-5">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Nuevo documento
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="document_type" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Tipo de documento
                </Label>

                <div className="relative">
                  <select
                    id="document_type"
                    value={documentType}
                    onChange={(event) =>
                      setDocumentType(event.target.value)
                    }
                    disabled={savingDocument}
                    className="h-10 w-full appearance-none rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15 dark:bg-input"
                  >
                    <option value="CEDULA">Cédula</option>
                    <option value="PASAPORTE">Pasaporte</option>
                    <option value="LICENCIA">Licencia</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_number" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Número de documento
                </Label>

                <Input
                  id="document_number"
                  placeholder="1723456789"
                  value={documentNumber}
                  onChange={(event) =>
                    setDocumentNumber(event.target.value)
                  }
                  disabled={savingDocument}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="document_file_url" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  URL de archivo / Comprobante (opcional)
                </Label>

                <Input
                  id="document_file_url"
                  placeholder="https://tudominio.com/documento.pdf"
                  value={documentFileUrl}
                  onChange={(event) =>
                    setDocumentFileUrl(event.target.value)
                  }
                  disabled={savingDocument}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_issue_date" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Fecha de emisión (opcional)
                </Label>

                <Input
                  id="document_issue_date"
                  type="date"
                  value={documentIssueDate}
                  onChange={(event) =>
                    setDocumentIssueDate(event.target.value)
                  }
                  disabled={savingDocument}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_expiry_date" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Fecha de expiración (opcional)
                </Label>

                <Input
                  id="document_expiry_date"
                  type="date"
                  value={documentExpiryDate}
                  onChange={(event) =>
                    setDocumentExpiryDate(event.target.value)
                  }
                  disabled={savingDocument}
                  className="h-10 rounded-xl border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all font-semibold dark:bg-input"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCreateDocument}
                disabled={savingDocument}
                className="rounded-xl bg-primary hover:opacity-90 font-bold h-10 px-5 text-primary-foreground shadow-md shadow-primary/20 active:scale-95 transition-all cursor-pointer"
              >
                {savingDocument ? 'Guardando...' : 'Agregar documento'}
              </Button>

              {documentFeedback && (
                <p className="text-xs font-semibold text-slate-500">
                  {documentFeedback}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Documentos registrados
            </h3>

            {documents.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-center text-sm font-semibold text-muted-foreground">
                No tienes documentos registrados.
              </p>
            ) : (
              <div className="grid gap-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                      <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                        {document.tipo_documento}
                      </span>

                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        document.verificado
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                      }`}>
                        {document.verificado ? 'Verificado' : 'Pendiente'}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-foreground">
                      Núm: <span className="font-semibold text-muted-foreground">{document.numero_documento}</span>
                    </p>

                    {document.archivo_url && (
                      <p className="mt-2 text-xs font-semibold text-primary hover:underline">
                        📄 <a href={document.archivo_url} target="_blank" rel="noreferrer">Ver documento adjunto</a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function ProfileDataItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-b-0">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">{value || 'Sin definir'}</span>
    </div>
  )
}