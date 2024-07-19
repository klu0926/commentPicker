function responseJSON(ok, resource, action, data, message, error) {
  if (ok !== true) {
    // fail
    return {
      ok: false,
      resource,
      action,
      data: null,
      message: `Failed to ${action} ${resource}`,
      error: typeof error === 'object' ? error.message : error // only send error message
    }
  } else {
    // Success
    return {
      ok: true,
      resource,
      action,
      data,
      message: `Successfully ${action} ${resource}`,
      error: null
    }
  }
}
module.exports = responseJSON