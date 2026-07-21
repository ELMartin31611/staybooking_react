import { useState } from 'react'
import {
  ExternalLink,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  AdminPageHeader,
  AdminPagination,
  formatAdminCurrency,
  formatAdminDate,
  StatusBadge,
} from '@/presentation/components/admin/AdminUi'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'
import { Input } from '@/presentation/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table'
import {
  useAdminInvoicesQuery,
  useAdminPaymentsQuery,
} from '@/presentation/hooks/useAdmin'

type BillingTab =
  | 'payments'
  | 'invoices'

export default function AdminBillingPage() {
  const [tab, setTab] =
    useState<BillingTab>('payments')

  const [paymentPage, setPaymentPage] =
    useState(1)

  const [invoicePage, setInvoicePage] =
    useState(1)

  const [searchInput, setSearchInput] =
    useState('')

  const [search, setSearch] =
    useState('')

  const [status, setStatus] =
    useState('')

  const paymentsQuery =
    useAdminPaymentsQuery({
      page: paymentPage,
      pageSize: 10,
      search,
      estado: status || undefined,
      ordering: '-created_at',
    })

  const invoicesQuery =
    useAdminInvoicesQuery({
      page: invoicePage,
      pageSize: 10,
      search,
      estado: status || undefined,
      ordering: '-fecha_emision',
    })

  function submitSearch(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setPaymentPage(1)
    setInvoicePage(1)
    setSearch(searchInput.trim())
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Pagos y facturas"
        description="Consulta el historial financiero generado por las reservas. Los registros son de solo lectura."
      />

      <div className="flex w-fit rounded-xl border bg-background p-1">
        <Button
          variant={
            tab === 'payments'
              ? 'default'
              : 'ghost'
          }
          onClick={() => {
            setTab('payments')
            setStatus('')
          }}
        >
          Pagos
        </Button>

        <Button
          variant={
            tab === 'invoices'
              ? 'default'
              : 'ghost'
          }
          onClick={() => {
            setTab('invoices')
            setStatus('')
          }}
        >
          Facturas
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <form
            className="grid gap-3 sm:grid-cols-[1fr_220px_auto]"
            onSubmit={submitSearch}
          >
            <Input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              placeholder={
                tab === 'payments'
                  ? 'Transacción, reserva o referencia...'
                  : 'Número, reserva o cliente...'
              }
            />

            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPaymentPage(1)
                setInvoicePage(1)
              }}
            >
              <option value="">
                Todos los estados
              </option>

              {tab === 'payments'
                ? (
                  <>
                    <option value="pendiente">
                      Pendiente
                    </option>

                    <option value="aprobado">
                      Aprobado
                    </option>

                    <option value="rechazado">
                      Rechazado
                    </option>
                  </>
                )
                : (
                  <>
                    <option value="emitida">
                      Emitida
                    </option>

                    <option value="pagada">
                      Pagada
                    </option>

                    <option value="anulada">
                      Anulada
                    </option>
                  </>
                )}
            </select>

            <Button
              type="submit"
              variant="outline"
            >
              <Search className="size-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {tab === 'payments'
        ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Transacción
                    </TableHead>

                    <TableHead>
                      Reserva
                    </TableHead>

                    <TableHead>
                      Método
                    </TableHead>

                    <TableHead>
                      Fecha
                    </TableHead>

                    <TableHead>
                      Estado
                    </TableHead>

                    <TableHead className="text-right">
                      Monto
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paymentsQuery.data?.results.map(
                    (payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <p className="font-medium">
                            {
                              payment
                                .codigo_transaccion
                            }
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {payment.referencia
                              || 'Sin referencia'}
                          </p>
                        </TableCell>

                        <TableCell>
                          {payment.reserva_codigo}
                        </TableCell>

                        <TableCell className="capitalize">
                          {payment.metodo_pago}
                        </TableCell>

                        <TableCell>
                          {formatAdminDate(
                            payment.fecha_pago
                              ?? payment.created_at,
                          )}
                        </TableCell>

                        <TableCell>
                          <StatusBadge
                            value={payment.estado}
                          />
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          {formatAdminCurrency(
                            payment.monto,
                            payment.moneda,
                          )}
                        </TableCell>
                      </TableRow>
                    ),
                  )}

                  {!paymentsQuery.isLoading
                    && paymentsQuery.data?.results.length === 0
                    && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-28 text-center text-muted-foreground"
                        >
                          No existen pagos
                          con esos filtros.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>

              <AdminPagination
                page={paymentPage}
                count={
                  paymentsQuery.data?.count
                  ?? 0
                }
                onChange={setPaymentPage}
              />
            </CardContent>
          </Card>
        )
        : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Factura
                    </TableHead>

                    <TableHead>
                      Cliente
                    </TableHead>

                    <TableHead>
                      Reserva
                    </TableHead>

                    <TableHead>
                      Fecha
                    </TableHead>

                    <TableHead>
                      Estado
                    </TableHead>

                    <TableHead className="text-right">
                      Total
                    </TableHead>

                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {invoicesQuery.data?.results.map(
                    (invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {
                            invoice
                              .numero_factura
                          }
                        </TableCell>

                        <TableCell>
                          {invoice.cliente_nombre}
                        </TableCell>

                        <TableCell>
                          {invoice.reserva_codigo}
                        </TableCell>

                        <TableCell>
                          {formatAdminDate(
                            invoice.fecha_emision,
                          )}
                        </TableCell>

                        <TableCell>
                          <StatusBadge
                            value={invoice.estado}
                          />
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          {formatAdminCurrency(
                            invoice.total,
                            invoice.moneda,
                          )}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            asChild
                          >
                            <Link
                              to={`/facturas/${invoice.id}`}
                            >
                              <ExternalLink className="size-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )}

                  {!invoicesQuery.isLoading
                    && invoicesQuery.data?.results.length === 0
                    && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-28 text-center text-muted-foreground"
                        >
                          No existen facturas
                          con esos filtros.
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>

              <AdminPagination
                page={invoicePage}
                count={
                  invoicesQuery.data?.count
                  ?? 0
                }
                onChange={setInvoicePage}
              />
            </CardContent>
          </Card>
        )}
    </section>
  )
}