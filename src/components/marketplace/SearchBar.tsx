"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (region) params.set("region", region);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-surface-container-high p-2 rounded-xl shadow-2xl border border-white/5 flex flex-col md:flex-row items-center gap-1"
    >
      <div className="flex-1 w-full flex items-center px-4">
        <span className="material-symbols-outlined text-outline mr-3">inventory_2</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Məhsul adı..."
          className="bg-transparent border-none focus:ring-0 text-on-surface w-full py-3 outline-none placeholder:text-outline text-sm"
        />
      </div>
      <div className="hidden md:flex flex-1 w-full items-center px-4 border-l border-white/10">
        <span className="material-symbols-outlined text-outline mr-3">category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-on-surface w-full py-3 appearance-none outline-none text-sm"
        >
          <option value="">Bütün kateqoriyalar</option>
        </select>
      </div>
      <div className="hidden md:flex flex-1 w-full items-center px-4 border-l border-white/10">
        <span className="material-symbols-outlined text-outline mr-3">location_on</span>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Şəhər / rayon..."
          className="bg-transparent border-none focus:ring-0 text-on-surface w-full py-3 outline-none placeholder:text-outline text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full md:w-auto bg-[#D47092] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
      >
        <span className="material-symbols-outlined">search</span>
        Axtar
      </button>
    </form>
  );
}
