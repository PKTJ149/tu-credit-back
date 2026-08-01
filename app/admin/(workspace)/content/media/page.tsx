"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ImageOff } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { mediaAssets as initialMediaAssets } from "@/lib/admin/mock-pages";
import type { MediaAsset } from "@/lib/admin/types";
import { MediaTile } from "./media-tile";
import { UploadDialog } from "./upload-dialog";

const FILE_TYPE_LABEL: Record<MediaAsset["fileType"], string> = {
  png: "PNG",
  jpg: "JPG",
  webp: "WebP",
  svg: "SVG",
  pdf: "PDF",
};

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(initialMediaAssets);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (typeFilter !== ALL_FILTER_VALUE && a.fileType !== typeFilter) return false;
      if (!query) return true;
      return a.filename.toLowerCase().includes(query);
    });
  }, [assets, search, typeFilter]);

  const typeOptions = useMemo(() => {
    const present = Array.from(new Set(assets.map((a) => a.fileType)));
    return present.map((t) => ({ value: t, label: FILE_TYPE_LABEL[t] }));
  }, [assets]);

  const filters: ToolbarFilter[] = [
    {
      id: "type",
      label: "ประเภทไฟล์",
      value: typeFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกประเภท" }, ...typeOptions],
      onChange: setTypeFilter,
    },
  ];

  function resetFilters() {
    setSearch("");
    setTypeFilter(ALL_FILTER_VALUE);
  }

  function handleDelete(id: string) {
    const asset = assets.find((a) => a.id === id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (asset) toast.success(`ลบไฟล์ "${asset.filename}" ออกจากคลังสื่อแล้ว`);
  }

  return (
    <>
      <PageHeader
        title="คลังสื่อ"
        description="ไฟล์รูปภาพและเอกสารทั้งหมดที่เว็บไซต์ใช้งาน พร้อมจุดที่แต่ละไฟล์ถูกอ้างอิงอยู่"
        actions={<UploadDialog />}
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาไฟล์"
        searchPlaceholder="ค้นหาชื่อไฟล์"
        filters={filters}
        onReset={resetFilters}
        resultSummary={`แสดง ${filtered.length} จาก ${assets.length} ไฟล์`}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageOff}
          title="ไม่พบไฟล์ที่ตรงกับตัวกรองนี้"
          description="ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
        />
      ) : (
        // A table would force filename/size/date into columns and shrink every
        // thumbnail to an icon — the one screen in the back office where the
        // content *is* the visual, so the grid is the right form and a table
        // would be the wrong one.
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {filtered.map((asset) => (
            <MediaTile key={asset.id} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}
