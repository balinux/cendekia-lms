import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { DataTable } from "@/components/sidebar/data-table";
import { SectionCards } from "@/components/sidebar/section-cards";
import data from "./data.json"
import adminGetEnrollmentStats from "../data/admin/admin-get-enrollment-stats";

export default async function AdminIndexPage() {
  const enrollmentdata = await adminGetEnrollmentStats()
  console.log(enrollmentdata)
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentdata} />
      {/* <DataTable data={data} /> */}
    </>
  )
}