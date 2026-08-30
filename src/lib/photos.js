// One rule, in one place: a resident's photo is shown to the public only
// after an admin has approved it. Admins see everything, with a banner
// saying what state it is in.
//
// Rows created before the review column existed have no photo_status; those
// carry a photo that was already live, so they stay visible.
export function photoIsPublic(spot) {
  if (!spot?.photo_url) return false
  return !spot.photo_status || spot.photo_status === 'approved'
}

// What an admin should see on the pin: the photo plus its review state.
export function photoReviewState(spot) {
  if (!spot?.photo_url) return null
  return spot.photo_status || 'approved'
}

export const PHOTO_STATUS_LABEL = {
  pending:  'Waiting for review',
  approved: 'Approved, visible to everyone',
  rejected: 'Rejected, hidden from the public',
}
