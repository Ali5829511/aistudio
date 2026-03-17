import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { addDoc, collection } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { View } from "../types";
import { cn, toArabicDigits } from "../utils";
import { Icon } from "../components/shared";

export const AddPropertyScreen = ({
  onSelect,
  properties,
}: {
  onSelect: (v: View) => void;
  properties: any[];
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");
  const [units, setUnits] = useState("");
  const [type, setType] = useState("سكني");
  const [status, setStatus] = useState("متاح");
  const [deedNumber, setDeedNumber] = useState("");
  const [deedDate, setDeedDate] = useState("");
  const [deedIssuer, setDeedIssuer] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [planNumber, setPlanNumber] = useState("");
  const [deedArea, setDeedArea] = useState("");
  const [deedType, setDeedType] = useState("إلكتروني");
  const [cadastralNumber, setCadastralNumber] = useState("");
  const [cadastralDate, setCadastralDate] = useState("");
  const [cadastralStatus, setCadastralStatus] = useState("مسجل");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [nationalAddress, setNationalAddress] = useState("");
  const [buildingType, setBuildingType] = useState("سكني");
  const [usagePurpose, setUsagePurpose] = useState("سكني وتجاري");
  const [floorsCount, setFloorsCount] = useState("");
  const [elevatorsCount, setElevatorsCount] = useState("");
  const [parkingCount, setParkingCount] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      setImages((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check for duplicates
    const exists = properties.some((p) => p.name === propertyName);
    if (exists) {
      setError("هذا العقار موجود بالفعل في النظام (تكرار)");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "properties"), {
        name: propertyName,
        location,
        units: Number(units) || 0,
        type,
        status,
        deedNumber,
        deedDate,
        deedIssuer,
        documentNumber,
        plotNumber,
        planNumber,
        deedArea,
        deedType,
        cadastralNumber,
        cadastralDate,
        cadastralStatus,
        region,
        city,
        district,
        nationalAddress,
        buildingType,
        usagePurpose,
        floorsCount,
        elevatorsCount,
        parkingCount,
        facilities,
        ownerName,
        ownerId,
        ownerPhone,
        ownerEmail,
      });
      setIsSuccess(true);
      setTimeout(() => onSelect("manager_dashboard"), 1500);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, "properties");
      setError("حدث خطأ أثناء إضافة العقار. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <Icon name="check_circle" className="text-6xl" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">تمت الإضافة بنجاح!</h2>
        <p className="text-slate-500">جاري توجيهك إلى لوحة التحكم...</p>
      </div>
    );
  }

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 print:shadow-none print:border-slate-200 print:break-inside-avoid">
      <h3 className="text-lg font-black text-brand-dark border-b border-slate-100 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const InputField = ({
    label,
    type = "text",
    placeholder = "",
    required = false,
    value,
    onChange,
  }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all print:border-none print:bg-transparent print:p-0 print:font-bold"
      />
    </div>
  );

  const SelectField = ({
    label,
    options,
  }: {
    label: string;
    options: string[];
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <select className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all print:appearance-none print:border-none print:bg-transparent print:p-0 print:font-bold">
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const TextAreaField = ({
    label,
    rows = 3,
  }: {
    label: string;
    rows?: number;
  }) => (
    <div className="flex flex-col gap-1 md:col-span-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <textarea
        rows={rows}
        className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all print:border-none print:bg-transparent print:p-0 print:font-bold"
      ></textarea>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="hidden print:block text-center pt-8 pb-4">
        <h1 className="text-3xl font-black text-brand-dark mb-2">
          تقرير تفصيلي للعقار
        </h1>
        <p className="text-slate-500">
          {new Date().toLocaleDateString("ar-SA")}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold print:hidden"
            >
              <Icon name="error" />
              {error}
            </motion.div>
          )}

          <Section title="البيانات العامة">
            <InputField
              label="اسم العقار"
              required
              value={propertyName}
              onChange={(e: any) => setPropertyName(e.target.value)}
            />
            <InputField
              label="الموقع / العنوان"
              value={location}
              onChange={(e: any) => setLocation(e.target.value)}
            />
            <InputField
              label="عدد الوحدات"
              type="number"
              value={units}
              onChange={(e: any) => setUnits(e.target.value)}
            />
            <InputField
              label="المدينة"
              value={city}
              onChange={(e: any) => setCity(e.target.value)}
            />
            <InputField
              label="الحي"
              value={district}
              onChange={(e: any) => setDistrict(e.target.value)}
            />
          </Section>

          <Section title="بيانات الصك والسجل العيني">
            <InputField
              label="رقم الصك"
              value={deedNumber}
              onChange={(e: any) => setDeedNumber(e.target.value)}
            />
            <InputField
              label="تاريخ الإصدار"
              type="date"
              value={deedDate}
              onChange={(e: any) => setDeedDate(e.target.value)}
            />
            <InputField
              label="جهة الإصدار"
              value={deedIssuer}
              onChange={(e: any) => setDeedIssuer(e.target.value)}
            />
            <InputField
              label="رقم المستند"
              value={documentNumber}
              onChange={(e: any) => setDocumentNumber(e.target.value)}
            />
            <InputField
              label="رقم القطعة"
              value={plotNumber}
              onChange={(e: any) => setPlotNumber(e.target.value)}
            />
            <InputField
              label="رقم المخطط"
              value={planNumber}
              onChange={(e: any) => setPlanNumber(e.target.value)}
            />
            <InputField
              label="مساحة الصك"
              type="number"
              value={deedArea}
              onChange={(e: any) => setDeedArea(e.target.value)}
            />
            <InputField
              label="نوع الصك"
              value={deedType}
              onChange={(e: any) => setDeedType(e.target.value)}
            />
            <InputField
              label="رقم تسجيل العيني"
              value={cadastralNumber}
              onChange={(e: any) => setCadastralNumber(e.target.value)}
            />
            <InputField
              label="تاريخ التسجيل"
              type="date"
              value={cadastralDate}
              onChange={(e: any) => setCadastralDate(e.target.value)}
            />
            <InputField label="حالة تسجيل العيني" />
          </Section>

          <Section title="بيانات العقار">
            <InputField label="المنطقة" />
            <InputField label="المدينة" />
            <InputField label="الحي" />
            <InputField label="العنوان الوطني" />
            <SelectField
              label="نوع المبنى"
              options={["سكني", "تجاري", "مختلط", "أخرى"]}
            />
            <InputField label="الغرض من الاستخدام" />
            <InputField label="عدد الطوابق" type="number" />
            <InputField label="الوحدات" type="number" />
            <InputField label="المصاعد" type="number" />
            <InputField label="المواقف" type="number" />
          </Section>

          <Section title="المرافق">
            <InputField label="مرفق 1" />
            <InputField label="مرفق 2" />
            <InputField label="مرفق 3" />
            <InputField label="مرفق 4" />
          </Section>

          <Section title="بيانات الوحدة">
            <SelectField
              label="نوع الوحدة"
              options={["شقة", "فيلا", "مكتب", "معرض", "مستودع"]}
            />
            <InputField label="رقم الوحدة" />
            <InputField label="رقم الطابق" />
            <InputField label="المساحة" type="number" />
            <SelectField
              label="حالة التأثيث"
              options={["غير مؤثث", "مؤثث جزئياً", "مؤثث بالكامل"]}
            />
            <SelectField label="خزائن مطبخ" options={["نعم", "لا"]} />
            <InputField label="عدد وحدات التكييف" type="number" />
            <TextAreaField label="تفاصيل الغرف" rows={2} />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="عداد الكهرباء 1" />
              <InputField label="عداد الكهرباء 2" />
              <InputField label="عداد الكهرباء 3" />
              <InputField label="عداد مياه" />
            </div>
          </Section>

          <Section title="بيانات المالك">
            <InputField label="اسم المالك" />
            <InputField label="رقم الهوية" />
            <InputField label="الجنسية" />
            <InputField label="نسبة الملكية" />
            <InputField label="مساحة الملكية" />
            <SelectField
              label="نوع المالك"
              options={["فرد", "شركة", "جهة حكومية", "أخرى"]}
            />
          </Section>

          <Section title="اتحاد الملاك">
            <InputField label="اسم الجمعية" />
            <InputField label="رقم التسجيل" />
            <InputField label="الرقم الموحد" />
            <InputField label="تاريخ السريان والانتهاء" />
            <SelectField
              label="حالة الجمعية"
              options={["نشطة", "غير نشطة", "تحت التأسيس"]}
            />
            <InputField label="اسم رئيس الجمعية" />
            <InputField label="رقم جوال رئيس الجمعية" type="tel" />
            <InputField label="اسم مدير العقار" />
            <InputField label="رقم جوال مدير العقار" type="tel" />
          </Section>

          <Section title="نتائج التصويت والرسوم">
            <InputField label="إجمالي الرسوم" type="number" />
            <InputField label="عدد المصوتين" type="number" />
            <InputField label="نسبة القبول" />
            <InputField label="غير المصوتين" type="number" />
          </Section>

          <Section title="عقد الإيجار">
            <InputField label="رقم العقد" />
            <SelectField
              label="نوع العقد"
              options={["سكني موحد", "تجاري موحد", "أخرى"]}
            />
            <InputField label="تاريخ الإبرام" type="date" />
            <InputField label="بداية ونهاية الإيجار" />
            <InputField label="مدة العقد" />
            <InputField label="قيمة الإيجار السنوي" type="number" />
            <InputField label="عدد الدفعات" type="number" />
            <InputField label="قنوات الدفع" />
          </Section>

          <Section title="بيانات المستأجر">
            <InputField label="اسم المستأجر" />
            <InputField label="الجنسية" />
            <SelectField
              label="نوع الهوية"
              options={["هوية وطنية", "إقامة", "جواز سفر", "سجل تجاري"]}
            />
            <InputField label="رقم الهوية" />
            <InputField label="الجوال" type="tel" />
            <InputField label="البريد الإلكتروني" type="email" />
          </Section>

          <Section title="الوسيط العقاري">
            <InputField label="اسم المنشأة" />
            <InputField label="السجل التجاري" />
          </Section>

          <Section title="ملاحظات">
            <TextAreaField label="ملاحظات إضافية" rows={4} />
          </Section>

          <Section title="المرافق">
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "مسبح",
                "نادي رياضي",
                "منطقة ألعاب أطفال",
                "كاميرات مراقبة",
                "حراسة أمنية",
                "مواقف سيارات",
                "مصعد",
                "حديقة",
              ].map((facility) => (
                <label
                  key={facility}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={facilities.includes(facility)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFacilities([...facilities, facility]);
                      } else {
                        setFacilities(facilities.filter((f) => f !== facility));
                      }
                    }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {facility}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <div className="space-y-4 print:hidden">
            <label className="text-sm font-bold text-slate-700 block">
              صور العقار
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Icon name="delete" className="text-sm" />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-primary transition-colors">
                <Icon name="add_a_photo" className="text-3xl mb-2" />
                <span className="text-xs font-medium">اضغط لرفع الصور</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover-lift print:hidden",
              isSubmitting
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-primary shadow-primary/20 hover:bg-primary-dark",
            )}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Icon name="sync" />
              </motion.div>
            ) : (
              "حفظ بيانات العقار"
            )}
          </button>
        </form>
      </div>
  );
};
