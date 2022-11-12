export function cropAddress(string = "", range = 5) {
  const [start, end] = [
    string?.substring(0, range),
    string?.substring(string?.length - range, string?.length),
    //
  ];
  return start + "..." + end;
}
