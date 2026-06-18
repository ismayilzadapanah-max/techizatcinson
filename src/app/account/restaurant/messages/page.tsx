"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function RestaurantMessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const conversations: never[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Mesajlar</h2>
        <p className="text-sm text-brand-muted">Təchizatçılarla yazışmalarınız.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] overflow-hidden min-h-[500px] flex">
        {/* Chat List */}
        <div className="w-full md:w-80 border-r border-[#E9E8EE] flex flex-col">
          <div className="p-4 border-b border-[#E9E8EE]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-soft-blue text-sm">search</span>
              <input type="text" placeholder="Söhbət axtar..." className="w-full pl-10 pr-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786]" />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex items-center justify-center h-full p-8">
                <EmptyState icon="forum" title="Hələ mesaj yoxdur" description="Təchizatçılarla əlaqə qurduqca söhbətləriniz burada görünəcək." />
              </div>
            ) : null}
          </div>
        </div>

        {/* Chat Window */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 bg-[#F9FAFB]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#F3F2F7] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-brand-soft-blue">forum</span>
            </div>
            <h4 className="text-lg font-semibold text-[#141647] mb-2">Söhbət seçilməyib</h4>
            <p className="text-sm text-brand-muted">Mesajlaşmaq üçün soldan bir söhbət seçin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
