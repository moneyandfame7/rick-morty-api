import axios from 'axios'
import { fillArray } from './fill-array'

export const fetchData = async <T>(url: string): Promise<T[]> => {
  const response = await axios.get(url)
  const countOfObjects = response.data.info.count
  const arr = fillArray(countOfObjects)
  const { data } = await axios.get(`${url}/${arr}`)

  return data
}
