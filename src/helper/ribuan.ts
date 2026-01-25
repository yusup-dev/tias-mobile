export const ribuanCast = (bilangan: string) => {
  var number_string = bilangan.toString(),
    sisa = number_string.length % 3,
    data = number_string.substr(0, sisa),
    ribuan = number_string.substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    let separator = sisa ? '.' : '';
    data += separator + ribuan.join('.');
  }
  return data;
};
