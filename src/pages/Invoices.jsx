import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Loader2, Calendar, CreditCard } from 'lucide-react';

export function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/invoices', { withCredentials: true });
        if (res.data) {
          setInvoices(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
        <span className="text-xs font-medium text-brand-text-secondary">Loading payment receipts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans select-none pb-24">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-blue" />
          Invoice History
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">
          Review payment receipts, billing dates, and invoices status ledger.
        </p>
      </div>

      <div className="glass-card border border-white/[0.08] p-5 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
                <th className="py-2.5 px-3">Invoice Number</th>
                <th className="py-2.5 px-3">Billing Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-brand-text-secondary">
                    No billing invoices generated yet. Update your subscription to start.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-white/[0.01]">
                    <td className="py-3 px-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 text-brand-text-secondary flex items-center gap-1.5 mt-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(inv.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-white font-mono">${inv.amount} USD</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://qapilot.app/receipts/${inv.invoiceNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] text-white text-[10px] font-bold uppercase transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Receipt
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoices;
