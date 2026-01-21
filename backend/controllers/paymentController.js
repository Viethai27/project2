// Fake payment/billing data
let bills = [
  {
    id: 'HD001',
    patientId: 'BN001',
    patientName: 'Nguyễn Văn A',
    date: '2026-01-05',
    insurance: 'DN4500123456789',
    hasInsurance: true,
    items: [
      { name: 'Phí khám bệnh', price: 150000, insuranceCoverage: 120000 },
      { name: 'Xét nghiệm máu', price: 200000, insuranceCoverage: 160000 },
      { name: 'Chụp X-quang', price: 300000, insuranceCoverage: 240000 },
      { name: 'Thuốc điều trị', price: 450000, insuranceCoverage: 0 }
    ],
    status: 'Chưa thanh toán',
    totalAmount: 1100000,
    insuranceAmount: 520000,
    patientAmount: 580000,
    createdAt: '2026-01-05T10:00:00Z'
  }
];

let transactions = [];

export const getAllBills = async (req, res) => {
  try {
    const { patientId, status } = req.query;

    let filteredBills = [...bills];

    if (patientId) {
      filteredBills = filteredBills.filter(b => b.patientId === patientId);
    }

    if (status && status !== 'all') {
      filteredBills = filteredBills.filter(b => b.status === status);
    }

    res.json({
      bills: filteredBills,
      total: filteredBills.length
    });
  } catch (error) {
    console.error('Get all bills error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = bills.find(b => b.id === req.params.id);
    
    if (!bill) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }

    res.json(bill);
  } catch (error) {
    console.error('Get bill by ID error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const searchBill = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Vui lòng nhập mã hóa đơn hoặc mã bệnh nhân' });
    }

    const bill = bills.find(b => b.id === query || b.patientId === query);

    if (!bill) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }

    res.json(bill);
  } catch (error) {
    console.error('Search bill error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createBill = async (req, res) => {
  try {
    const { patientId, patientName, insurance, hasInsurance, items } = req.body;

    if (!patientId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const billId = `HD${String(bills.length + 1).padStart(3, '0')}`;

    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
    const insuranceAmount = items.reduce((sum, item) => sum + (item.insuranceCoverage || 0), 0);
    const patientAmount = totalAmount - insuranceAmount;

    const newBill = {
      id: billId,
      patientId,
      patientName,
      date: new Date().toISOString().split('T')[0],
      insurance: insurance || '',
      hasInsurance: hasInsurance || false,
      items,
      status: 'Chưa thanh toán',
      totalAmount,
      insuranceAmount,
      patientAmount,
      createdAt: new Date().toISOString()
    };

    bills.push(newBill);

    res.status(201).json({
      message: 'Tạo hóa đơn thành công',
      bill: newBill
    });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { billId, amount, paymentMethod } = req.body;

    if (!billId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin thanh toán' });
    }

    const billIndex = bills.findIndex(b => b.id === billId);
    
    if (billIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }

    const bill = bills[billIndex];

    if (bill.status === 'Đã thanh toán') {
      return res.status(400).json({ message: 'Hóa đơn đã được thanh toán' });
    }

    // Create transaction
    const transactionId = `TT${Date.now()}`;
    const transaction = {
      id: transactionId,
      billId,
      amount,
      paymentMethod,
      status: 'Thành công',
      createdAt: new Date().toISOString()
    };

    transactions.push(transaction);

    // Update bill status
    bills[billIndex].status = 'Đã thanh toán';
    bills[billIndex].paidAt = new Date().toISOString();
    bills[billIndex].transactionId = transactionId;

    res.json({
      message: 'Thanh toán thành công',
      transaction,
      bill: bills[billIndex]
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const { patientId } = req.query;

    let filteredTransactions = [...transactions];

    if (patientId) {
      const patientBills = bills.filter(b => b.patientId === patientId).map(b => b.id);
      filteredTransactions = transactions.filter(t => patientBills.includes(t.billId));
    }

    res.json({
      transactions: filteredTransactions,
      total: filteredTransactions.length
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
