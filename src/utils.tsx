export function logError(message: any) {
  // tslint:disable-next-line
  if (console && console.error) {
    // tslint:disable-next-line
    console.error(message);
  }
}
