export interface WalletBalance {
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface WalletTransaction {
  txnId: string;
  type: 'CREDIT' | 'DEBIT';
  source: 'WELCOME_BONUS' | 'TOP_UP' | 'ORDER_PAYMENT' | 'REFUND';
  amount: number;
  note: string;
  date: string;
}

export const walletService = {
  getWalletBalance(): WalletBalance {
    const stored = localStorage.getItem('student_wallet');
    if (!stored) {
      const defaultWallet: WalletBalance = {
        balance: 0,
        currency: 'INR',
        updatedAt: new Date().toISOString()
      };
      this.saveWalletBalance(defaultWallet);
      return defaultWallet;
    }
    return JSON.parse(stored);
  },

  saveWalletBalance(wallet: WalletBalance): void {
    localStorage.setItem('student_wallet', JSON.stringify(wallet));
  },

  getTransactions(): WalletTransaction[] {
    const stored = localStorage.getItem('student_wallet_transactions');
    return stored ? JSON.parse(stored) : [];
  },

  saveTransactions(transactions: WalletTransaction[]): void {
    localStorage.setItem('student_wallet_transactions', JSON.stringify(transactions));
  },

  addMoney(amount: number, paymentMethod: string): void {
    if (amount <= 0) return;

    const wallet = this.getWalletBalance();
    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();
    this.saveWalletBalance(wallet);

    const transaction: WalletTransaction = {
      txnId: `WALLET_TXN_${Date.now()}`,
      type: 'CREDIT',
      source: 'TOP_UP',
      amount,
      note: `Money added via ${paymentMethod}`,
      date: new Date().toISOString()
    };

    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
  },

  debitWallet(amount: number, note: string): boolean {
    const wallet = this.getWalletBalance();
    if (wallet.balance < amount) return false;

    wallet.balance -= amount;
    wallet.updatedAt = new Date().toISOString();
    this.saveWalletBalance(wallet);

    const transaction: WalletTransaction = {
      txnId: `WALLET_TXN_${Date.now()}`,
      type: 'DEBIT',
      source: 'ORDER_PAYMENT',
      amount,
      note,
      date: new Date().toISOString()
    };

    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
    return true;
  },

  creditWallet(amount: number, source: WalletTransaction['source'], note: string): void {
    const wallet = this.getWalletBalance();
    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();
    this.saveWalletBalance(wallet);

    const transaction: WalletTransaction = {
      txnId: `WALLET_TXN_${Date.now()}`,
      type: 'CREDIT',
      source,
      amount,
      note,
      date: new Date().toISOString()
    };

    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
  }
};