export function formatDateString(date) {
  return (
    new Date(date) //
      .toLocaleDateString('ja-JP')
      .replace('/', '年')
      .replace('/', '月') + '日'
  );
}
