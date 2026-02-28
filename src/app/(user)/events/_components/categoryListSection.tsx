import { categoryRequest } from "@/apiRequest/category";


export default async function CategoriesSection() {
  const res = await categoryRequest.getList({pageNumber: 1, pageSize: 100,isDescending: true})
  console.log(res)
  return (
    <div>
      <h1>CategoriesSection</h1>
    </div>
  )
}