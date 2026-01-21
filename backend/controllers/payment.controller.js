import paymentService from '../services/payment.service.js';

// @desc    Get bill
// @route   GET /api/payment/bill
// @access  Private
export const getBill = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập thông tin tìm kiếm',
      });
    }

    const bill = await paymentService.getBill(q);

    res.json({
      success: true,
      bill,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Process payment
// @route   POST /api/payment/process
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const result = await paymentService.processPayment(req.body, req.user.id);

    res.json({
      success: true,
      message: 'Thanh toán thành công',
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payment/history/:patientId
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const history = await paymentService.getPaymentHistory(patientId);

    res.json({
      success: true,
      ...history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create invoice
// @route   POST /api/payment/invoice
// @access  Private
export const createInvoice = async (req, res) => {
  try {
    const bill = await paymentService.createInvoice(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Tạo hóa đơn thành công',
      bill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
