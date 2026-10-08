import BookingTable from "@/components/admin/BookingTable";

export default function AdminBookingsPage() {
  return (
    <>
      <h1 className="mb-6 font-serif text-4xl text-forest">Bookings</h1>
      <BookingTable />
    </>
  );
}