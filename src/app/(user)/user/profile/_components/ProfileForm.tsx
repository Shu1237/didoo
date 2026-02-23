"use client";

import { useSessionStore } from "@/stores/sesionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Save, X, Shield, Key } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";

export default function ProfileForm() {
  const user = useSessionStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"profile" | "email" | "security">("profile");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const tabs = [
    { id: "profile", label: "Hồ sơ", icon: User },
    { id: "email", label: "Email", icon: Mail },
    { id: "security", label: "Bảo mật", icon: Shield },
  ] as const;

  return (
    <div className="flex flex-col gap-10">
      {/* Tab Navigation */}
      <div className="flex p-2 bg-slate-100 border border-slate-200 rounded-[24px] w-fit shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-[18px] text-[13px] font-bold tracking-tight transition-all duration-300 ${activeTab === tab.id
              ? "bg-white text-slate-900 shadow-md scale-[1.03] ring-1 ring-slate-200"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#FF9B8A]" : "text-slate-400"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.99 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1"
        >
          {activeTab === "profile" && (
            <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden rounded-[32px]">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-[#FF9B8A]/10 rounded-xl">
                    <User className="w-5 h-5 text-[#FF9B8A]" />
                  </div>
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium ml-12">Cập nhật thông tin hồ sơ của bạn ở đây.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Tên hiển thị
                      </label>
                      <Input
                        id="name"
                        defaultValue={user?.FullName || ""}
                        placeholder="Nhập tên của bạn"
                        className="h-12 bg-white border-slate-200 text-slate-900 font-semibold focus:border-[#FF9B8A] focus:ring-[#FF9B8A]/20 transition-all rounded-2xl px-5 text-sm"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Email hiện tại
                      </label>
                      <Input
                        value={user?.Email || ""}
                        disabled
                        className="h-12 bg-slate-50/80 border-slate-100 text-slate-400 font-bold rounded-2xl px-5 text-sm cursor-not-allowed border-dashed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-12 pt-8 border-t border-slate-50">
                    <Button variant="ghost" className="rounded-full px-8 text-slate-500 font-bold hover:bg-slate-100 h-11">
                      Hủy
                    </Button>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 shadow-lg shadow-slate-900/10 font-bold flex items-center gap-2 h-11">
                      <Save className="w-4 h-4" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "email" && <ChangeEmailForm />}
          {activeTab === "security" && <ChangePasswordForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
