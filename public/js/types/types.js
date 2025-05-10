/*=================================================| DATA |=================================================*/

// Users ///////////////////////////

/**
 * @typedef {Object} User User model
 * @property {string} _id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {string} birth
 * @property {string} job
 * @property {string} photo
 * @property {string} role
 */

/** @typedef {Record<string, User>} Users Users list */

// Products ///////////////////////////

/**
 * @typedef {Object} Details
 * @property {number} area
 * @property {number} price
 * @property {number} rooms
 * @property {string} type
 */

/**
 * @typedef {Object} Images
 * @property {string} src
 * @property {string} alt
 */

/**
 * @typedef {Object} Product Product model
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {Details} details
 * @property {Images} thumbnail
 * @property {Images[]} pictures
 * @property {string} bookingId
 * @property {string} reviewId
 */

/** @typedef {Record<string, Product>} Products Products list */

// Bookings ///////////////////////////

/**
 * @typedef {Object} BookingsRegistred
 * @property {string} _id
 * @property {string} userId
 * @property {string} userName
 * @property {string} startingDate
 * @property {string} endingDate
 * @property {number | string} createdAt
 */

/**
 * @typedef {Object} Booking
 * @property {BookingsRegistred[]} bookings
 * @property {string} productName
 * @property {string} productId
 */

/** @typedef {Record<string, Booking} Bookings Bookings list */

// Charts ///////////////////////////

/**
 * @typedef {Object} ChartBuildType
 * @property {HTMLDivElement} element
 * @property {string} name
 * @property {string} title
 * @property {number[]} categories
 * @property {(number | string)[]} data
 * @property {"area" | "bar" | "donut"} chartType
 * @property {"solid" | "gradient"} fillType
 */

// Visits (www.lesilesdeguadeloupe.com) ///////////////////////////

/**
 * @typedef {Object} Visit
 * @property {string} image
 * @property {string} href
 * @property {string} text
 * @property {string} title
 */

/** @typedef {Record<string, Visit} Visits Bookings list */

/*=================================================| FUNCTIONS |=================================================*/

/**
 * @typedef {Object} ChartDataType
 * @property {number[]} chartData
 * @property {string[]} chartCategories
 */

/** @typedef {(data: ChartDataType, source: User | Booking) => void} FilterFunctionType */

/*=================================================| INTERFACE |=================================================*/

/**
 * @typedef {Object} FormInputType
 * @property {string} type
 * @property {string} [label]
 * @property {string} [name]
 * @property {string} [placeholder]
 * @property {number} [maxLength]
 * @property {number} [minLength]
 * @property {string} [autocomplete]
 * @property {string | number} [value]
 */

/**
 * @typedef {Object} FormContentType
 * @property {string} action
 * @property {string} changePhoto
 * @property {FormInputType[]} content
 * @property {string} method
 * @property {string} title
 */

/** @typedef {[HTMLImageElement, HTMLParagraphElement, HTMLParagraphElement, HTMLParagraphElement, HTMLParagraphElement]} UserCardDivDetails */

export {};
