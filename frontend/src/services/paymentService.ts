import { createClient } from '@/lib/supabase/client'

export interface XenditInvoiceRequest {
  external_id: string
  amount: number
  description: string
  payer_email: string
  success_redirect_url: string
  failure_redirect_url: string
  currency?: string
}

export interface XenditInvoiceResponse {
  id: string
  external_id: string
  user_id: string
  status: string
  merchant_name: string
  merchant_profile_picture_url: string
  amount: number
  payer_email: string
  description: string
  expiry_date: string
  invoice_url: string
  available_banks: any[]
  available_retail_outlets: any[]
  created: string
  updated: string
  currency: string
}

/**
 * Philippine Payment Gateway Integration (Xendit)
 * Handles payment processing for court bookings
 */
export const paymentService = {
  /**
   * Create Xendit invoice for booking payment
   * Xendit API: https://api.xendit.co/v2/invoices
   */
  async createPaymentInvoice(request: {
    bookingId: number
    amount: number
    courtName: string
    userEmail: string
    successUrl: string
    failureUrl: string
  }): Promise<{ success: boolean; invoiceUrl?: string; invoiceId?: string; error?: string }> {
    try {
      // Get Xendit API key from environment
      const xenditApiKey = process.env.NEXT_PUBLIC_XENDIT_API_KEY || process.env.XENDIT_API_KEY
      
      if (!xenditApiKey) {
        return { success: false, error: 'Payment gateway not configured' }
      }

      const invoiceRequest: XenditInvoiceRequest = {
        external_id: `booking_${request.bookingId}_${Date.now()}`,
        amount: request.amount,
        description: `Pickleball Court Booking - ${request.courtName}`,
        payer_email: request.userEmail,
        success_redirect_url: request.successUrl,
        failure_redirect_url: request.failureUrl,
        currency: 'PHP'
      }

      const response = await fetch('https://api.xendit.co/v2/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(xenditApiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceRequest)
      })

      if (!response.ok) {
        throw new Error(`Xendit API error: ${response.statusText}`)
      }

      const data = await response.json() as XenditInvoiceResponse

      return {
        success: true,
        invoiceUrl: data.invoice_url,
        invoiceId: data.id
      }
    } catch (error) {
      console.error('Error creating payment invoice:', error)
      return { success: false, error: 'Failed to create payment invoice' }
    }
  },

  /**
   * Verify payment status from Xendit webhook
   */
  async verifyPayment(invoiceId: string): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const xenditApiKey = process.env.XENDIT_API_KEY
      
      if (!xenditApiKey) {
        return { success: false, error: 'Payment gateway not configured' }
      }

      const response = await fetch(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(xenditApiKey + ':').toString('base64')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Xendit API error: ${response.statusText}`)
      }

      const data = await response.json() as XenditInvoiceResponse

      return {
        success: true,
        status: data.status
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      return { success: false, error: 'Failed to verify payment' }
    }
  },

  /**
   * Handle Xendit webhook callback for payment confirmation
   */
  async handlePaymentWebhook(invoiceData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      
      // Update booking with payment confirmation
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: invoiceData.status === 'PAID' ? 'paid' : 'failed',
          transaction_id: invoiceData.id,
          status: invoiceData.status === 'PAID' ? 'confirmed' : 'pending'
        })
        .eq('id', parseInt(invoiceData.external_id.split('_')[1]))

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error handling payment webhook:', error)
      return { success: false, error: 'Failed to process payment confirmation' }
    }
  },

  /**
   * Get payment methods available in Philippines
   */
  getPhilippinePaymentMethods() {
    return [
      { value: 'gcash', label: 'GCash', icon: '📱' },
      { value: 'credit_card', label: 'Credit Card', icon: '💳' },
      { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
      { value: 'cash', label: 'Cash on Site', icon: '💵' }
    ]
  },

  /**
   * Calculate total with discount
   */
  calculateTotal(pricePerHour: number, durationHours: number, discountPercent: number = 0): number {
    const subtotal = pricePerHour * durationHours
    const discount = (subtotal * discountPercent) / 100
    return Math.round((subtotal - discount) * 100) / 100
  }
}
