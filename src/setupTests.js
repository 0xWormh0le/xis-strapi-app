import 'react-dates/initialize'
// Add any global mocks in here //

// Suppress react act warnings as not able to update react version while using expo!
jest.spyOn(console, 'error').mockImplementation((...args) => {
  if (!args[0].includes('Warning: An update to %s inside a test was not wrapped in act')) {
    consoleError(...args)
  }
})
