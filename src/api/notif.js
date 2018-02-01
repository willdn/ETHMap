import iziToast from 'izitoast'

/**
 * Create a notification
 * @param {string} - Notification's message
 */
export const add = (options) => {
  iziToast.show({
    message: `${options.message}`,
    color: options.color,
    position: 'bottomCenter',
    timeout: 3000,
    transitionIn: 'bounceInUp',
    image: (options.image) ? options.image : ''
  })
}

/**
 * Create a success notification
 * @param {string} - Notification's message
 */
export const success = (message) => {
  add({
    color: 'green',
    message: `${message}`
  })
}

/**
 * Create an error notification
 * @param {string} - Notification's message
 */
export const error = (message) => {
  add({
    color: 'red',
    message: `${message}`
  })
}

/**
 * Create an Transaction denied notification
 * @param {string} - Notification's message
 */
export const transactionDenied = (erorMessage) => {
  if (erorMessage.includes('User denied transaction signature.')) {
    error(`Transaction signature denied`)
  }
}

export const zoneBought = (zone) => {
  add({
    color: 'green',
    message: `<b>${zone.name}</b> bought !`,
    image: require(`@/assets/flags/${zone.code.toLowerCase()}.svg`)
  })
}

export const zoneSell = (zone, price) => {
  add({
    color: 'green',
    message: `<b>${zone.name}</b> on sale for ${price} Ξ !`,
    image: require(`@/assets/flags/${zone.code.toLowerCase()}.svg`)
  })
}

export const zoneXfer = (zone, to) => {
  add({
    color: 'green',
    message: `<b>${zone.name}</b> transferred to ${to.substring(0, 10)}... !`,
    image: require(`@/assets/flags/${zone.code.toLowerCase()}.svg`)
  })
}
