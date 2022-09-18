/**
 * Helper function to convert an object into an array.
 * @param object - the object to be converted into an array.
 */

export const getArrayFromObject = (object: any) => {
  let arrayFromObject: any[] = []

  if (object && typeof object === 'object') {
    Object.keys(object).forEach((key) => {
      arrayFromObject.push({ accessor: key, value: object[key] })
    })
  }

  return arrayFromObject
}
