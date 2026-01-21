import Billing from '../models/PAYMENT/Billing.model.js';
import PaymentTransaction from '../models/PAYMENT/PaymentTransaction.model.js';
import Visit from '../models/4. APPOINTMENT_VISIT/Visit.model.js';

class PaymentService {
  // Get bill by ID or patient ID
  async getBill(searchTerm) {
    const bill = await Billing.findOne({
      $or: [
        { _id: searchTerm },
        { visit: searchTerm },
      ],
    })
      .populate({
        path: 'visit',
        populate: { path: 'patient', select: 'full_name phone' }
      })
      .populate('admission');

    if (!bill) {
      throw new Error('Không tìm thấy hóa đơn');
    }

    return bill;
  }

  // Process payment
  async processPayment(paymentData, userId) {
    const { billId, amount, paymentMethod } = paymentData;

    // Find bill
    const bill = await Billing.findById(billId);
    if (!bill) {
      throw new Error('Không tìm thấy hóa đơn');
    }

    if (bill.status === 'PAID') {
      throw new Error('Hóa đơn đã được thanh toán');
    }

    if (bill.status === 'CANCELLED') {
      throw new Error('Hóa đơn đã bị hủy');
    }

    // Create payment transaction
    const transaction = await PaymentTransaction.create({
      billing: billId,
      amount,
      payment_method: paymentMethod || 'CASH',
      status: 'COMPLETED',
      processed_by: userId,
    });

    // Update bill status
    bill.status = 'PAID';
    await bill.save();

    return {
      transaction,
      bill,
    };
  }

  // Get payment history for a patient
  async getPaymentHistory(patientId) {
    // Find all visits for the patient
    const visits = await Visit.find({ patient: patientId }).select('_id');
    const visitIds = visits.map(v => v._id);

    // Find all bills for these visits
    const bills = await Billing.find({ visit: { $in: visitIds } })
      .populate('visit')
      .sort({ created_at: -1 });

    // Get transactions for these bills
    const billIds = bills.map(b => b._id);
    const transactions = await PaymentTransaction.find({ billing: { $in: billIds } })
      .populate('billing')
      .sort({ transaction_date: -1 });

    return {
      bills,
      transactions,
    };
  }

  // Create invoice/bill
  async createInvoice(invoiceData, userId) {
    const { visitId, admissionId, total_amount } = invoiceData;

    if (!visitId && !admissionId) {
      throw new Error('Cần có visit hoặc admission để tạo hóa đơn');
    }

    const bill = await Billing.create({
      visit: visitId,
      admission: admissionId,
      total_amount,
      status: 'PENDING',
    });

    return bill;
  }

  // Get all bills
  async getAllBills(filters = {}) {
    const bills = await Billing.find(filters)
      .populate({
        path: 'visit',
        populate: { path: 'patient', select: 'full_name phone' }
      })
      .sort({ created_at: -1 });

    return bills;
  }
}

export default new PaymentService();
