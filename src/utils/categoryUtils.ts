import type { CategoryProps } from "../types"

export const sortData = (categories: CategoryProps[]) => {
  const groups = categories
    .filter((cat) => cat.optGroup)
    .sort((a, b) => a.order - b.order)

  const items = categories
    .filter((cat) => !cat.optGroup)
    .sort((a, b) => a.order - b.order)

  const groupedData = groups.map((group) => ({
    id: group.id,
    name: group.name,
    order: group.order,
    image: group.image,
    children: items.filter((item) => item.groupID === group.id),
  }))

  return groupedData
}

export const fetchCategory = async () => {
  try {
    const res = await fetch('https://mmk-backend.onrender.com/category')
    const data = await res.json()
    return data
  } catch (err) {
    console.error('Failed to fetch products:', err)
    return err
  }
}

export const getCategoryGroupName = async (category: number): Promise<string> => {
  const res = await fetchCategory();

  const productCategory = res.find((el: CategoryProps) => el.id === category)
  if (!productCategory) return ''

  const groupCategory = res.find((el: CategoryProps) => el.id === productCategory.groupID)
  if (!groupCategory) return ''

  return groupCategory.name.toLowerCase()
}
