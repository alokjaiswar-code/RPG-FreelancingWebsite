"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client"; // Adjust path based on your setup

interface Client {
  id: string;
  name: string;
  company_name: string;
  email: string;
  status: string;
  total_spent: number;
}

export default function ClientList() {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (!error && data) setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase.from("clients").insert([
      {
        user_id: userData.user.id,
        name,
        company_name: company,
        email,
        status: "Active",
      },
    ]);

    if (!error) {
      setName("");
      setCompany("");
      setEmail("");
      setIsModalOpen(false);
      fetchClients();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-amber-400">📜 Client Roster (Patrons)</h2>
          <p className="text-slate-400 text-sm">Manage client details and project contracts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-lg transition"
        >
          + Add New Client
        </button>
      </div>

      {/* Client Cards Grid */}
      {loading ? (
        <p className="text-slate-500">Loading roster...</p>
      ) : clients.length === 0 ? (
        <p className="text-slate-400 italic">No clients added yet. Register your first quest giver!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-slate-100">{client.name}</h3>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {client.status}
                  </span>
                </div>
                {client.company_name && <p className="text-xs text-amber-400/80 mt-0.5">{client.company_name}</p>}
                <p className="text-sm text-slate-400 mt-2">{client.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Register New Client</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400">Client / Contact Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Lord Vance"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Ironclad Studios"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  placeholder="vance@ironclad.com"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded text-sm transition"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}