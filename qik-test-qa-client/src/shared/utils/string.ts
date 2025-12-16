export const formPriceString = (
  price: number,
  divider: string = ' ',
  currency: string = '₽'
): string => {
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)

  return `${formatted}${divider}${currency}`
}

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  const match = digits.match(/^7?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)

  if (!match) return value

  let result = '+7'
  if (match[1]) result += ` (${match[1]}`
  if (match[1] && match[1].length === 3) result += ')'
  if (match[2]) result += ` ${match[2]}`
  if (match[3]) result += `-${match[3]}`
  if (match[4]) result += `-${match[4]}`
  return result
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
