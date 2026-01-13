"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";

type Props = {
  placeholder?: string;
  onSearch: (value: string) => void;
};

export function SearchBar({ placeholder, onSearch }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      onSearch(value);
    }, 250);
    return () => clearTimeout(handle);
  }, [value, onSearch]);

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Search rugs..."}
      />
    </div>
  );
}
