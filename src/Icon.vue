<script setup lang="ts">
defineProps<{name:string}>();
const paths:Record<string,string>={
grid:'M3 3h18v18H3z M3 9h18 M9 3v18 M3 15h18 M15 9v12',
database:'M4 6c0-4 16-4 16 0s-16 4-16 0v12c0 4 16 4 16 0V6 M4 12c0 4 16 4 16 0',
search:'M16 16l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
chart:'M3 3v18h18 M7 16v-5 M12 16V6 M17 16V9',
edit:'m15 4 5 5 M4 15 16 3l5 5L9 20l-6 1z',
download:'M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5',
file:'M14 2H5v20h14V7z M14 2v5h5 M8 12h8 M8 16h8',
box:'m3 7 9-5 9 5v10l-9 5-9-5z M3 7l9 5 9-5 M12 12v10 M7 4l10 6',
building:'M5 21V3h14v18 M2 21h20 M9 7h1 M14 7h1 M9 11h1 M14 11h1 M10 21v-5h4v5',
pie:'M12 3a9 9 0 1 0 9 9h-9z M15 2v7h7a8 8 0 0 0-7-7',
arrow:'M4 12h16 m-6-6 6 6-6 6',
chevron:'m9 5 7 7-7 7',
close:'m5 5 14 14 M5 19 19 5',
expand:'M8 3H3v5 M16 3h5v5 M3 16v5h5 M16 21h5v-5',
copy:'M9 9h12v12H9z M15 9V3H3v12h6',
mail:'M3 5h18v14H3z m0 0 9 8 9-8',
check:'m4 12 5 5L20 6',
menu:'M3 6h18 M3 12h18 M3 18h18',
shield:'m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z m-5 10 4 4 6-7',
code:'m8 6-6 6 6 6 m8-12 6 6-6 6 M14 3l-4 18',
chat:'M21 11a9 8 0 0 1-9 8H6l-4 3 1-7a9 8 0 1 1 18-4 M7 10h1 M11 10h1 M15 10h1',
qr:'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M14 14h3v3h4v4h-7z'
};
</script>
<template><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="paths[name] || paths.grid"/></svg></template>
