<template>
  <div class="trade-box">
    <div class="top" @click="choiceCoin">
      <img :src="tokenImg" alt="" />
      <div class="coin-info">
        <div class="name">
          <input v-if="token" class="coin-name" readonly type="text" v-model="token.coinCodeShow" />
          <input v-else class="coin-name" readonly type="text" :placeholder="$t('select')" />
          <svg t="1623379978208" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1190">
            <path d="M934.4 512v19.6096l-0.0512 11.52-0.0768 9.6512-0.1024 8.6016-0.128 7.936-0.1536 7.3984-0.1792 6.9888-0.2048 6.656-0.256 6.4-0.256 6.144-0.3072 5.9392-0.3072 5.76-0.3584 5.5808-0.384 5.4528-0.4096 5.2992-0.4352 5.1968-0.4608 5.0688-0.512 4.9664-0.512 4.864-0.5376 4.7872-0.5888 4.6848-0.5888 4.608-0.64 4.5312-0.6656 4.4544-0.6912 4.352-0.7168 4.3264-0.7424 4.2496-0.768 4.1728-0.8192 4.1472-0.8192 4.0704-0.8704 3.9936-0.8704 3.968-0.9216 3.8912-0.9472 3.84-0.9728 3.84-0.9984 3.7376-1.024 3.712-1.0496 3.6608-1.1008 3.6096-1.1008 3.584-1.152 3.5328-1.152 3.4816-1.2032 3.456-1.2288 3.4048-1.28 3.3536-1.28 3.328-1.28 3.3024-1.3568 3.2512-1.3568 3.2-1.408 3.1744-1.408 3.1488-1.4592 3.0976-1.4848 3.072-1.5104 3.0208-1.536 2.9952-1.5616 2.9696-1.6128 2.944-1.6128 2.8928-1.6384 2.8416-1.6896 2.816-1.7152 2.816-1.7408 2.7648-1.7664 2.7392-1.792 2.688-1.8176 2.6624-1.8688 2.6368-1.8688 2.6112-1.92 2.56-1.92 2.56-1.9712 2.5088-2.0224 2.4576-2.0224 2.4576-2.048 2.4064-2.0736 2.4064-2.1248 2.3552-2.1504 2.304-2.176 2.304-2.2016 2.2784-2.2272 2.2272-2.2784 2.2016-2.304 2.176-2.304 2.1504-2.3552 2.1248-2.3808 2.0736-2.4064 2.048-2.4576 2.048-2.4832 1.9968-2.5088 1.9712-2.5344 1.9456-2.56 1.92-2.6112 1.8944-2.6368 1.8432-2.6368 1.8176-2.7136 1.792-2.7136 1.792-2.7648 1.7408-2.816 1.7152-2.816 1.664-2.8416 1.664-2.8928 1.6128-2.944 1.6128-2.944 1.5616-2.9952 1.536-3.0464 1.536-3.072 1.4592-3.072 1.4592-3.1488 1.4336-3.1744 1.408-3.2 1.3568-3.2512 1.3312-3.3024 1.3312-3.328 1.28-3.328 1.2544-3.4304 1.2288-3.4304 1.2032-3.4816 1.1776-3.5328 1.1264-3.584 1.1264-3.584 1.0752-3.6864 1.0752-3.6864 1.024-3.7632 1.024-3.7888 0.9472-3.84 0.9472-3.9168 0.9216-3.9424 0.896-4.0192 0.8448-4.0704 0.8448-4.096 0.7936-4.1984 0.768-4.2496 0.768-4.3008 0.7168-4.352 0.6912-4.4544 0.6656-4.5312 0.64-4.608 0.6144-4.6592 0.5632-4.7872 0.5632-4.864 0.512-4.9408 0.512-5.0688 0.4608-5.1712 0.4352-5.2992 0.4096-5.4528 0.384-5.5808 0.3584-5.7344 0.3072-5.9136 0.3072-6.144 0.256-6.3488 0.256-6.656 0.2048-6.9632 0.2048-7.3728 0.1536-7.8592 0.128-8.5504 0.1024-9.5488 0.0768-11.3152 0.0256-16.9984 0.0256h-22.1952l-11.7248-0.0512-9.7792-0.0768-8.6784-0.0768-7.9616-0.128-7.424-0.1536-7.04-0.1792-6.6816-0.2304-6.4-0.2304-6.1696-0.256-5.9648-0.3072-5.76-0.3072-5.632-0.3584-5.4272-0.384-5.3248-0.4096-5.1968-0.4096-5.0944-0.4608-4.9664-0.512-4.864-0.512-4.7872-0.5376-4.7104-0.5888-4.608-0.5888-4.5312-0.64-4.4544-0.6656-4.3776-0.6912-4.3264-0.7168-4.2496-0.7424-4.1984-0.768-4.1216-0.7936-4.0704-0.8192-4.0192-0.8704-3.968-0.8704-3.8912-0.9216-3.84-0.9472-3.84-0.9728-3.7632-0.9984-3.6864-1.024-3.6864-1.0496-3.6096-1.0752-3.584-1.1264-3.5328-1.1264-3.4816-1.1776-3.456-1.2032-3.4048-1.2032-3.3792-1.28-3.328-1.28-3.3024-1.28-3.2512-1.3568-3.2-1.3568-3.1744-1.3824-3.1488-1.4336-3.1232-1.4336-3.072-1.4848-3.0208-1.536-2.9952-1.536-2.9696-1.536-2.9184-1.6128-2.9184-1.6128-2.8672-1.6384-2.816-1.6896-2.816-1.7152-2.7648-1.7152-2.7136-1.792-2.7136-1.792-2.6624-1.792-2.6368-1.8688-2.6112-1.8688-2.56-1.92-2.56-1.92-2.5088-1.9712-2.4832-1.9968-2.432-2.048-2.432-2.048-2.3808-2.0736-2.3552-2.1248-2.3296-2.1248-2.304-2.176-2.2784-2.2016-2.2272-2.2272-2.2016-2.2784-2.2016-2.2784-2.1504-2.304-2.0992-2.3808-2.0992-2.3808-2.048-2.4064-2.048-2.432-1.9968-2.4832-1.9712-2.5088-1.9456-2.5344-1.92-2.56-1.8944-2.5856-1.8432-2.6368-1.8432-2.6624-1.792-2.688-1.792-2.7392-1.7152-2.7648-1.7152-2.7904-1.6896-2.816-1.664-2.8416-1.6128-2.8928-1.6128-2.9184-1.5616-2.9696-1.536-2.9952-1.536-3.0208-1.4848-3.072-1.4592-3.072-1.4336-3.1488-1.3824-3.1744-1.3824-3.2-1.3312-3.2512-1.3312-3.2768-1.28-3.328-1.28-3.3536-1.2032-3.4048-1.2032-3.4304-1.1776-3.4816-1.152-3.5328-1.1008-3.584-1.1008-3.584-1.0496-3.6608-1.024-3.712-1.024-3.7376-0.9728-3.7888-0.9472-3.84-0.9216-3.9168-0.896-3.9424L102.4 700.0576l-0.8192-4.0704-0.8192-4.096-0.768-4.1984-0.768-4.224-0.7168-4.3008-0.6912-4.3776-0.6656-4.4544-0.64-4.5056-0.6144-4.608-0.5888-4.6592-0.5376-4.7616-0.512-4.864-0.512-4.9408-0.4608-5.0432-0.4608-5.1712-0.4096-5.2992-0.384-5.4016-0.3584-5.5808-0.3328-5.7344-0.2816-5.888-0.256-6.144-0.256-6.3232-0.2304-6.6304-0.1792-6.912-0.1536-7.3472-0.1536-7.8336-0.0768-8.4736-0.0768-9.472-0.0512-11.1104-0.0256-15.872v-23.2192l0.0512-11.9808 0.0512-9.8816 0.1024-8.7552 0.128-8.0128 0.1536-7.4752 0.1792-7.04 0.2048-6.7328 0.2304-6.4 0.256-6.1952 0.3072-5.9904 0.3072-5.7856 0.3584-5.6064 0.3584-5.4528 0.4096-5.3504 0.4352-5.1968 0.4608-5.0944 0.4864-4.992 0.512-4.864 0.5632-4.7872 0.5632-4.7104 0.5888-4.608 0.64-4.5568 0.6656-4.4544 0.6656-4.4032 0.7168-4.3264 0.768-4.2496 0.768-4.1984 0.768-4.1216 0.8448-4.096 0.8448-3.9936 0.896-3.968 0.896-3.9168 0.9472-3.8656 0.9728-3.8144 0.9984-3.7632 1.024-3.712 1.024-3.6608 1.1008-3.6352 1.1008-3.584 1.152-3.5328 1.152-3.4816 1.2032-3.456 1.2032-3.4304 1.28-3.3536 1.2544-3.328 1.3056-3.328 1.3312-3.2512 1.3824-3.2 1.3824-3.2 1.408-3.1232 1.4592-3.1232 1.4848-3.072 1.4848-3.0208 1.536-3.0208 1.5616-2.9696 1.5872-2.944 1.6384-2.8928 1.6384-2.8672 1.664-2.816 1.7152-2.816 1.7408-2.7648 1.7664-2.7392 1.792-2.688 1.792-2.688 1.8688-2.6368 1.8688-2.6112 1.92-2.56 1.92-2.56 1.9712-2.5088 1.9968-2.4832 2.0224-2.4576 2.048-2.4064 2.0736-2.4064 2.1248-2.3552 2.1248-2.3296 2.176-2.304 2.2016-2.2784 2.2272-2.2272 2.2528-2.2272 2.304-2.176 2.304-2.1504 2.3552-2.1248 2.3808-2.0992 2.4064-2.048 2.4576-2.048 2.4576-1.9968 2.5088-1.9712 2.5344-1.9456 2.56-1.92 2.5856-1.8944 2.6368-1.8688 2.6624-1.8176 2.688-1.792 2.7136-1.792 2.7648-1.7408 2.7904-1.7152 2.816-1.6896 2.8672-1.664 2.8672-1.6384 2.9184-1.5872 2.9696-1.5872 2.9952-1.536 3.0208-1.536 3.072-1.4592 3.072-1.4592 3.1232-1.4336 3.1744-1.408 3.2-1.3824 3.2512-1.3312 3.2768-1.3312 3.328-1.28 3.328-1.28 3.4048-1.2032 3.456-1.2288 3.456-1.152 3.5328-1.152 3.584-1.1264 3.584-1.1008 3.6608-1.0496 3.6864-1.024 3.7376-1.024 3.7888-0.9728 3.84-0.9472 3.9168-0.9216 3.9424-0.896 3.9936-0.8704 4.0448-0.8448 4.096-0.7936 4.1984-0.7936 4.224-0.768 4.3008-0.7168 4.352-0.6912 4.4544-0.6656 4.5056-0.64 4.5824-0.6144 4.6592-0.5888 4.7616-0.5376 4.8384-0.5376 4.9408-0.512 5.0432-0.4608 5.1712-0.4352 5.2736-0.4096 5.4272-0.4096 5.5552-0.3584 5.7088-0.3328 5.888-0.2816 6.0928-0.2816 6.3232-0.256 6.6048-0.2048 6.912-0.2048 7.296-0.1536 7.7824-0.128 8.4224-0.1024 9.344-0.0768 10.9568-0.0512 15.0528-0.0256h23.8848l12.2624 0.0512 9.984 0.0512 8.832 0.1024 8.064 0.1024 7.5008 0.1536 7.0912 0.1792 6.7328 0.2048 6.4512 0.256 6.1952 0.256 5.9904 0.256 5.8112 0.3328 5.632 0.3584 5.4784 0.3584 5.3248 0.4096 5.2224 0.4352 5.12 0.4608 4.9664 0.4608 4.8896 0.512 4.8128 0.5632 4.6848 0.5632 4.6336 0.5888 4.5568 0.64 4.4544 0.6656 4.4032 0.6656 4.352 0.7168 4.2496 0.7424 4.1984 0.768 4.1216 0.7936 4.096 0.8192 4.0192 0.8448 3.968 0.896 3.9168 0.896 3.8656 0.9472 3.8144 0.9728 3.7632 0.9728 3.712 1.024 3.6864 1.0496 3.6352 1.0752 3.584 1.1264 3.5328 1.1264 3.5072 1.152 3.456 1.2032 3.4048 1.2288 3.3792 1.2288 3.328 1.28 3.328 1.3056 3.2256 1.3312 3.2256 1.3568 3.2 1.3824 3.1488 1.4336 3.0976 1.4336 3.072 1.4848 3.072 1.5104 2.9952 1.536 2.9696 1.536 2.9184 1.5872 2.9184 1.6384 2.8672 1.6384 2.816 1.664 2.816 1.7152 2.7648 1.7152 2.7392 1.792 2.7136 1.7664 2.6624 1.8176 2.6624 1.8432 2.6112 1.8688 2.56 1.92 2.56 1.92 2.5088 1.9712 2.4832 1.9968 2.4576 2.0224 2.432 2.048 2.3808 2.048 2.3808 2.1248 2.304 2.1504 2.304 2.176 2.304 2.176 2.2272 2.2272 2.2272 2.2528 2.176 2.304 2.1504 2.304 2.1248 2.3552 2.0992 2.3808 2.048 2.4064 2.048 2.432 2.0224 2.4576 1.9712 2.5088 1.9456 2.5344 1.92 2.56 1.8944 2.5856 1.8688 2.6368 1.8176 2.6624 1.792 2.6624 1.792 2.7392 1.7664 2.7392 1.7152 2.7904 1.6896 2.816 1.664 2.8672 1.6128 2.8672 1.6128 2.9184 1.5872 2.944 1.536 2.9952 1.536 3.0208 1.4848 3.072 1.4592 3.072 1.4336 3.1488 1.408 3.1488 1.3568 3.2 1.3568 3.2512 1.3312 3.2768 1.28 3.328 1.28 3.328 1.2288 3.4048 1.2032 3.4304 1.1776 3.4816 1.152 3.5072 1.1264 3.584 1.0752 3.584 1.0752 3.6352 1.024 3.712 1.024 3.7376 0.9728 3.7888 0.9472 3.84 0.9216 3.8656 0.896 3.9424 0.8704 3.9936 0.8448 4.0448 0.8192 4.096 0.768 4.1984 0.768 4.224 0.7168 4.2752 0.7168 4.352 0.6656 4.4544 0.64 4.5056 0.6144 4.5568 0.5888 4.6592 0.5632 4.7616 0.512 4.8384 0.512 4.9408 0.4864 5.0176 0.4352 5.1456 0.4096 5.2736 0.384 5.4016 0.3584 5.5552 0.3584 5.7088 0.2816 5.888 0.2816 6.0672 0.256 6.2976 0.2304 6.5792 0.1792 6.8864 0.1536 7.2448 0.1536 7.7312 0.1024 8.3712 0.0768 9.2928 0.0512 10.752 0.0256 14.4384V512z" fill="#2c2c2c" p-id="1191"></path>
            <path d="M860.3392 512v16.1792l-0.0512 9.472-0.0512 7.9872-0.0768 7.0912-0.1024 6.528-0.128 6.1184-0.1536 5.76-0.1792 5.504-0.2048 5.248-0.2048 5.0688-0.256 4.9152-0.256 4.736-0.3072 4.608-0.3072 4.5056-0.3328 4.352-0.3584 4.3008-0.384 4.1728-0.4096 4.096-0.4352 4.0192-0.4352 3.9424-0.4864 3.84-0.512 3.84-0.512 3.712-0.5376 3.6608-0.5632 3.6096-0.5888 3.584-0.64 3.4816-0.6144 3.456-0.6656 3.4048-0.6912 3.3536-0.7168 3.328-0.7168 3.2512-0.768 3.2-0.768 3.2-0.8192 3.1232-0.8192 3.0976-0.8448 3.072-0.8704 3.0208-0.896 2.9696-0.9216 2.944-0.9216 2.9184-0.9728 2.8672-0.9984 2.8416-1.024 2.816-1.024 2.7648-1.0496 2.7648-1.0752 2.7136-1.1008 2.6624-1.1264 2.6624-1.152 2.6112-1.1776 2.5856-1.2032 2.56-1.2288 2.5344-1.2288 2.5088-1.28 2.4576-1.28 2.4576-1.3312 2.4064-1.3312 2.3808-1.3568 2.3808-1.3824 2.304-1.4336 2.304-1.4336 2.304-1.4336 2.2528-1.4848 2.2272-1.5104 2.176-1.536 2.176-1.536 2.1504-1.5872 2.1248-1.5872 2.0992-1.6384 2.048-1.6384 2.048-1.6896 2.048-1.6896 1.9712-1.7152 1.9712-1.7408 1.9456-1.792 1.92-1.792 1.8944-1.792 1.8688-1.8432 1.8432-1.8688 1.8176-1.8944 1.792-1.92 1.792-1.9456 1.7408-1.9712 1.7152-1.9712 1.6896-2.048 1.6896-2.0224 1.6384-2.048 1.6128-2.0992 1.6128-2.1248 1.5872-2.1504 1.536-2.176 1.536-2.176 1.536-2.2272 1.4592-2.2528 1.4592-2.304 1.4336-2.304 1.408-2.304 1.3824-2.3552 1.3824-2.3808 1.3312-2.432 1.3312-2.432 1.28-2.4832 1.28-2.4832 1.2288-2.5344 1.2288-2.56 1.2032-2.56 1.1776-2.6368 1.152-2.6368 1.1264-2.688 1.1008-2.7136 1.1008-2.7392 1.0496-2.7648 1.024-2.816 1.024-2.816 0.9984-2.8928 0.9728-2.9184 0.9216-2.944 0.9216-2.9696 0.896-3.0208 0.8704-3.072 0.8704-3.072 0.8192-3.1488 0.7936-3.1488 0.768-3.2256 0.768-3.2512 0.7424-3.328 0.7168-3.328 0.6912-3.4048 0.6656-3.456 0.6144-3.5072 0.64-3.5328 0.5888-3.6096 0.5632-3.6864 0.5376-3.712 0.5376-3.7888 0.512-3.8656 0.4608-3.9424 0.4608-3.9936 0.4352-4.096 0.4096-4.1728 0.384-4.2752 0.3584-4.352 0.3328-4.5056 0.3072-4.608 0.3072-4.7104 0.256-4.8896 0.256-5.0688 0.2304-5.248 0.2048-5.4784 0.1536-5.7344 0.1536-6.0672 0.128-6.5024 0.128-7.04 0.0768-7.8848 0.0512-9.3184 0.0512h-32.3328l-9.6768-0.0512-8.0384-0.0512-7.168-0.0768-6.5792-0.1024-6.144-0.128-5.76-0.1536-5.5296-0.1536-5.2736-0.2048-5.0944-0.2304-4.9152-0.2304-4.7616-0.256-4.608-0.3072-4.5056-0.3072-4.4032-0.3328-4.2752-0.3584-4.1728-0.384-4.096-0.4096-4.0448-0.4096-3.9424-0.4608-3.8656-0.4608-3.8144-0.512-3.7376-0.512-3.6608-0.5376-3.6096-0.5888-3.584-0.5888-3.5072-0.6144-3.4304-0.64-3.4304-0.64-3.328-0.6912-3.328-0.7168-3.2768-0.7168-3.2256-0.768-3.1744-0.768-3.1232-0.7936-3.1232-0.8192-3.072-0.8448-2.9952-0.8704-2.9952-0.896-2.944-0.9216-2.9184-0.9472-2.8672-0.9472-2.8672-0.9984-2.816-1.024-2.7648-1.024-2.7392-1.024-2.7136-1.1008-2.688-1.1008-2.6624-1.1264-2.6112-1.152-2.5856-1.1776-2.56-1.1776-2.56-1.2288-2.4832-1.2288-2.4832-1.28-2.432-1.28-2.432-1.3312-2.3808-1.3312-2.3552-1.3568-2.3296-1.3824-2.304-1.408-2.304-1.4336-2.2528-1.4592-2.2272-1.4848-2.2016-1.4848-2.176-1.536-2.1504-1.536-2.1248-1.5872-2.0736-1.5872-2.0736-1.6384-2.048-1.6384-2.048-1.664-1.9712-1.7152-1.9712-1.7152-1.9456-1.7408-1.92-1.7664-1.8944-1.792-1.8688-1.792-1.8432-1.8688-1.8176-1.8432-1.792-1.8944-1.792-1.92-1.7408-1.9456-1.7408-1.9456-1.6896-1.9968-1.664-2.0224-1.664-2.048-1.6384-2.048L217.7024 768l-1.5872-2.1248-1.536-2.1248-1.536-2.176-1.536-2.2016-1.4848-2.2016-1.4592-2.2528-1.4336-2.2784-1.408-2.304-1.3824-2.304-1.3824-2.3808-1.3312-2.3808-1.3312-2.4064-1.28-2.432-1.28-2.4832-1.2544-2.4832-1.2032-2.5344-1.2032-2.56-1.1776-2.56-1.152-2.6368-1.152-2.6368-1.1008-2.688-1.0752-2.688-1.0752-2.7392-1.024-2.7904-1.024-2.816-0.9984-2.816-0.9728-2.8672-0.9216-2.9184-0.9216-2.944-0.9216-2.9696-0.8704-3.0208-0.8448-3.0464-0.8192-3.072-0.8192-3.1488-0.768-3.1744-0.768-3.2-0.7424-3.2512-0.7168-3.328-0.6656-3.328-0.6912-3.4048-0.64-3.4304-0.6144-3.5072-0.5888-3.5328-0.5632-3.6096-0.5632-3.6608-0.512-3.712-0.512-3.7888-0.4864-3.84-0.4608-3.9424-0.4352-4.0192-0.4096-4.0704-0.384-4.1728-0.3584-4.2496-0.3328-4.352-0.3328-4.48-0.2816-4.608-0.256-4.7104-0.256-4.864-0.256-5.0688-0.1792-5.2224-0.1792-5.4528-0.1536-5.7344-0.128-6.0416-0.1024-6.4512-0.1024-6.9888-0.0512-7.808-0.0256-9.1648-0.0256-13.0816v-19.1744l0.0256-9.8816 0.0768-8.1408 0.0768-7.2192 0.0768-6.6048 0.128-6.144 0.1536-5.8368 0.1792-5.5296 0.1792-5.2992 0.2304-5.12 0.256-4.9152 0.256-4.7616 0.256-4.6336 0.3328-4.5056 0.3328-4.4032 0.3584-4.3008 0.3584-4.1984 0.4096-4.096 0.4352-4.0192 0.4352-3.968 0.4864-3.8656 0.512-3.8144 0.512-3.7376 0.512-3.6864 0.5888-3.6096 0.5888-3.584 0.6144-3.5072 0.6144-3.456 0.6656-3.4048 0.6912-3.3536 0.6912-3.328 0.7424-3.2512 0.7424-3.2512 0.768-3.1744 0.8192-3.1488 0.8192-3.0976 0.8448-3.072 0.8448-3.0208 0.896-2.9952 0.9216-2.944 0.9472-2.9184 0.9472-2.8928 0.9984-2.816 0.9984-2.816 1.024-2.816 1.0496-2.7392 1.0752-2.7136 1.1008-2.688 1.1264-2.6368 1.152-2.6368 1.1776-2.5856 1.2032-2.56 1.2032-2.56 1.2544-2.4832 1.2544-2.4832 1.28-2.4576 1.3056-2.4064 1.3568-2.4064 1.3568-2.3552 1.3824-2.3296 1.408-2.304 1.408-2.304 1.4592-2.2528 1.4848-2.2272 1.5104-2.2016 1.536-2.176 1.536-2.1504 1.5616-2.1248 1.5872-2.0992 1.6384-2.048 1.6384-2.0736 1.664-2.0224 1.6896-1.9968 1.7152-1.9712 1.7408-1.9456 1.792-1.92 1.7664-1.8944 1.792-1.8688 1.8688-1.8688 1.8432-1.792 1.8944-1.8176 1.92-1.792 1.9456-1.7408 1.9456-1.7152 1.9968-1.7152 1.9968-1.664 2.048-1.664 2.048-1.6384 2.0992-1.5872 2.1248-1.5872 2.1248-1.5616 2.176-1.536 2.2016-1.5104 2.2016-1.4848 2.2528-1.4592 2.2784-1.4336 2.304-1.4336 2.304-1.3824 2.3808-1.3568 2.3552-1.3568 2.432-1.3056 2.432-1.3056 2.4576-1.28 2.4832-1.2544 2.5344-1.2288 2.56-1.2032 2.56-1.1776 2.6368-1.152 2.6368-1.1264 2.6624-1.1264 2.7136-1.0752 2.7392-1.0752 2.7648-1.024 2.816-1.024 2.816-0.9984 2.8672-0.9728 2.8928-0.9216 2.944-0.9472 2.9696-0.896 3.0208-0.8704 3.072-0.8448 3.072-0.8448 3.1232-0.7936 3.1744-0.768 3.2-0.768 3.2512-0.768 3.3024-0.6912 3.328-0.6912 3.4048-0.6656 3.4304-0.6656 3.5072-0.6144 3.5328-0.5888 3.584-0.5888 3.6864-0.5376 3.712-0.512 3.7632-0.512 3.84-0.512 3.9424-0.4352 3.9936-0.4352 4.096-0.4096 4.1472-0.4096 4.2496-0.3584 4.352-0.3328 4.4544-0.3328 4.608-0.2816 4.7104-0.256 4.864-0.256 5.0176-0.256 5.2224-0.1792 5.4272-0.1792 5.7088-0.1792 6.016-0.128 6.4-0.1024 6.9632-0.0768 7.7056-0.0768 9.0112-0.0256 12.4416-0.0256h19.712l10.0864 0.0256 8.2432 0.0512 7.2704 0.0768 6.656 0.1024 6.1952 0.128 5.8368 0.1536 5.5552 0.1536 5.3248 0.2048 5.12 0.2048 4.9408 0.256 4.7616 0.256 4.6592 0.256 4.5056 0.3328 4.4032 0.3328 4.3008 0.3584 4.224 0.3584 4.096 0.4096 4.0448 0.4096 3.9424 0.4608 3.8912 0.4608 3.8144 0.512 3.7376 0.512 3.6864 0.5376 3.6352 0.5632 3.584 0.5888 3.5072 0.6144 3.456 0.6144 3.4048 0.6656 3.3792 0.6912 3.328 0.6912 3.2512 0.7168 3.2512 0.768 3.1744 0.768 3.1488 0.7936 3.0976 0.8192 3.072 0.8448 3.0208 0.8704 2.9952 0.8704 2.9696 0.9216 2.9184 0.9472 2.8928 0.9472 2.8416 0.9728 2.816 1.024 2.7904 1.024 2.7392 1.0496 2.7136 1.0752 2.688 1.1008 2.6624 1.1264 2.6368 1.1264 2.5856 1.1776 2.56 1.2032 2.56 1.2032 2.5088 1.2544 2.4576 1.2544 2.4576 1.28 2.432 1.3056 2.3808 1.3568 2.3808 1.3568 2.3296 1.3568 2.304 1.408 2.304 1.4336 2.2528 1.4592 2.2272 1.4592 2.2016 1.5104 2.176 1.536 2.1504 1.536 2.1248 1.5616 2.0992 1.5872 2.0992 1.6384 2.048 1.6384 2.0224 1.664 1.9968 1.6896 1.9712 1.7152 1.9456 1.7408 1.92 1.7664 1.8944 1.792 1.8944 1.792 1.8432 1.8432 1.8176 1.8688 1.792 1.8688 1.792 1.92 1.7408 1.9456 1.7408 1.9456 1.6896 1.9968 1.6896 1.9968 1.664 2.048 1.6128 2.048 1.6128 2.0992 1.5872 2.0992 1.5616 2.1504 1.536 2.1504 1.536 2.2016 1.4592 2.2016 1.4592 2.2528 1.4592 2.2784 1.408 2.304 1.408 2.304 1.3568 2.3552 1.3568 2.3808 1.3056 2.4064 1.3056 2.432 1.28 2.4576 1.2544 2.5088 1.2288 2.5088 1.2032 2.56 1.1776 2.56 1.152 2.6368 1.152 2.6368 1.1008 2.6624 1.1008 2.688 1.0496 2.7392 1.0496 2.7648 1.024 2.816 0.9984 2.816 0.9728 2.8672 0.9472 2.8928 0.9216 2.944 0.896 2.9696 0.8704 3.0208 0.8704 3.0464 0.8192 3.072 0.8192 3.1232 0.768 3.1744 0.768 3.2 0.768 3.2512 0.6912 3.3024 0.6912 3.328 0.6656 3.3792 0.6656 3.4304 0.6144 3.5072 0.5888 3.5328 0.5888 3.584 0.5632 3.6608 0.512 3.712 0.512 3.7632 0.4864 3.84 0.4608 3.9424 0.4352 3.968 0.4096 4.096 0.384 4.1472 0.384 4.224 0.3328 4.352 0.3328 4.4544 0.2816 4.5824 0.2816 4.7104 0.256 4.8384 0.2304 5.0176 0.2048 5.1968 0.1792 5.4272 0.1536 5.6576 0.128 5.9904 0.128 6.4 0.0768 6.8864 0.0768 7.6544 0.0256 8.8832 0.0256 11.8784V512z" fill="#ffffff" p-id="1192"></path>
            <path d="M374.7328 431.9744l129.8944 172.16a9.1392 9.1392 0 0 0 14.6688 0l129.9456-172.16c4.8128-6.4 0.512-15.7952-7.296-15.7952h-259.84c-7.7824 0-12.1856 9.3952-7.3728 15.7952z" fill="#2c2c2c" p-id="1193"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="xian"></div>
    <div class="bottom" :style="
        depositUsdtAmt || receiveUsdtAmt ? 'height:120px' : 'height:100px'
      ">
      <div class="bottomInner">
        <div class="tip">
          <div class="type" v-if="type === 'from'">
            {{ $t('balance') }}{{ this.balance }}
          </div>
          <div class="type" v-if="type === 'to'">
            {{ $t('expectedText') }}
          </div>
        </div>
        <div class="input_view">
          <input ref="input" class="number" :class="numberColor" :style="number === 0 ? 'color:#000;' : ''" @mousewheel="stopScrollFun" @DOMMouseScroll="stopScrollFun" @blur="isFocus = false" @focus="isFocus = true" @input="inputNumber" :value="number" placeholder="0" type="number" :readonly="type === 'to'" v-if="!( token && type == 'from' && token.mainNetwork == 'BRC20')" />
          <Select :no-data-text="$t('Engraved') + ': 0'" v-model="balanceSelect" placeholder="0" class="number" v-if="token && type == 'from' && token.mainNetwork == 'BRC20'">
            <Option v-for="item in balanceOptions" :key="item.value" :label="item.label" :value="item.value">
            </Option>
          </Select>
          <div v-if="token && type === 'from' && token.mainNetwork != 'BRC20'" @click="getMax" class="max themeBg">
            MAX
          </div>
        </div>
        <div class="USDTAmount">
          <div v-if="type === 'from' && depositUsdtAmt">
            ≈{{ depositUsdtAmt }} USD
          </div>
          <div v-if="type === 'to' && receiveUsdtAmt">
            ≈{{ receiveUsdtAmt }} USD
          </div>
        </div>
      </div>
      <div class="range" v-if="
          type === 'from' &&
          info &&
          (info.dex === 'SWFT' || info.dex === 'bridgers1')
        ">
        {{ $t('range')
        }}{{
          isFreeGas && info.dex === 'SWFT'
            ? info.noGasDepositMin
            : info.depositMin
        }}~{{
          isFreeGas && info.dex === 'SWFT'
            ? info.noGasDepositMax
            : info.depositMax
        }}
      </div>
    </div>
    <CoinList v-if="$store.state.coinList.length > 0" :type="type" ref="coinList"></CoinList>
    <activeAcct v-if="allAccountsSS58 && type == 'from'" :listAcct="allAccountsSS58"></activeAcct>
  </div>
</template>
<script>
const CoinList = () => import("./common/coinList.vue");
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import activeAcct from "./common/activeAcct";
import axios from "axios";
import { Toast } from "vant";
import baseApi from "../api/baseApi";
import { Option, Select } from "element-ui";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import joyIdMethids from '../utils/joyID/swapMethods'
let WalletConnectProvider = null;
let provider;
let flagThrottle = null;
export default {
  name: "TradeBox",
  components: {
    CoinList,
    activeAcct,
    Option,
    Select,
  },
  props: {
    type: {
      type: String,
      default: "from",
    },
  },
  data() {
    return {
      isFocus: false,
      allAccountsSS58: null,
      depositUSDTRate: "",
      receiveUSDTRate: "",
      depositUsdtAmt: null,
      receiveUsdtAmt: null,
      balanceSelect: null,
    };
  },
  created() {
    this.$bus.on("openAcct", (val) => {
      this.openAcct(val);
    });
    this.$bus.on("checkPolkadot", (val) => {
      this.checkPolk(val);
    });
    if (this.token && this.token.coinCode.indexOf("USDT") == -1) {
      this.getUsdtRate();
    }
  },
  beforeDestroy() {
    this.$bus.off("openAcct", this.openAcct);
    this.$bus.on("checkPolkadot");
  },
  watch: {
    balanceSelect(val) {
      const list = this.balanceOptions.filter(
        (item) => item.inscriptionId == val
      );
      this.number = list[0].data.amt;
      this.$store.commit("setinscriptionId", list[0].inscriptionId);
    },
    number(val, old) {
      if (this.type === "from") {
        if (this.token && this.token.coinCode.indexOf("USDT") == -1) {
          if (val != "") {
            this.depositUsdtAmt = new BigNumber(this.depositUSDTRate)
              .multipliedBy(BigNumber(val))
              .toFixed(6, BigNumber.ROUND_DOWN);
          } else {
            this.depositUsdtAmt = "0.000000";
          }
        } else {
          this.depositUsdtAmt = this.number;
        }
      }
      if (this.type === "to") {
        if (this.token && this.token.coinCode.indexOf("USDT") == -1) {
          if (val != "") {
            this.receiveUsdtAmt = new BigNumber(this.receiveUSDTRate)
              .multipliedBy(BigNumber(val))
              .toFixed(6, BigNumber.ROUND_DOWN);
          } else {
            this.receiveUsdtAmt = "0.000000";
          }
        } else {
          this.receiveUsdtAmt = this.number;
        }
      }
    },
    info(val, old) {
      if (val === null) return;
      const inputSource = this.$store.state.inputSource;
      const fromNumber = this.$store.state.fromNumber;
      const toNumber = this.$store.state.toNumber;
      const instantRate = this.info.instantRate || 1;
      const depositCoinFeeRate = this.info.depositCoinFeeRate;
      if (inputSource === "from") {
        let number = fromNumber * instantRate * (1 - depositCoinFeeRate);
        if (number < 0) number = 0;
        this.$store.commit("setToNumber", number === 0 ? 0 : number.toFixed(6));
      } else if (inputSource === "to") {
        const number = toNumber / (instantRate * (1 - depositCoinFeeRate));
        this.$store.commit(
          "setFromNumber",
          number === 0 ? 0 : number.toFixed(6)
        );
      }
    },
    token(val, old) {
      if (val && val.coinCode.indexOf("USDT") == -1) {
        this.getUsdtRate();
      } else {
        if (this.type === "from") {
          this.depositUsdtAmt = this.number;
        }
        if (this.type === "to") {
          this.receiveUsdtAmt = this.number;
        }
      }
    },
  },
  computed: {
    balanceOptions() {
      return this.$store.state.balanceOptions;
    },
    isFreeGas() {
      return this.$store.state.isFreeGas;
    },
    walletAddress() {
      if (this.$store.state.chainId == "000") {
        return this.$store.state.walletPolkadot.addrSS58;
      }
      if (this.$store.state.chainId == "222") {
        return this.$store.state.walletPolkadot.addrSS58CRU;
      } else if (this.$store.state.chainId == "333") {
        return this.$store.state.walletPolkadot.addrSS58DBC;
      } else if (this.$store.state.chainId == "0") {
        return this.$store.state.walletTRON;
      } else {
        return this.$store.state.wallet.address;
      }
    },
    connectType() {
      return this.$store.state.wallet.connectType;
    },
    tokenImg() {
      if (this.token) {
        if (this.token.mainNetwork === "NFT") {
          return this.token.logoURI;
        }
        return `https://transfer.swft.pro/swft-v3/images/coins/${this.token.coinCode}.png`;
      } else {
        return require("../assets/img/noToken.png");
      }
    },
    balance() {
      return this.$store.state.balance;
    },
    info() {
      return this.$store.state.info;
    },
    numberColor() {
      return this.number ? "number-color" : "";
    },
    number: {
      get() {
        if (this.type === "from") {
          return this.$store.state.fromNumber;
        } else {
          return this.$store.state.toNumber - 0;
        }
      },
      set(val) {
        if (this.type === "from") {
          this.$store.commit("setFromNumber", val);
        } else {
          this.$store.commit("setToNumber", val);
        }
      },
    },
    token: {
      get() {
        if (this.type === "from") {
          return this.$store.state.fromToken;
        } else {
          return this.$store.state.toToken;
        }
      },
      set(val) {
        if (this.type === "from") {
          this.$store.commit("setFromToken", val);
        } else {
          this.$store.commit("setToToken", val);
        }
      },
    },
    wallet() {
      return this.$store.state.wallet.name;
    },
    NFTChange() {
      return this.$store.state.NFTChange;
    },
  },
  methods: {
    inputNumber($event) {
      if (this.type === "from") {
        this.$store.commit("setFromNumber", $event.target.value);
      }
    },
    throttle(fn, delay) {
      var context = this;
      var args = arguments;
      if (!flagThrottle) {
        flagThrottle = setTimeout(function () {
          fn.apply(context, args);
          flagThrottle = null;
        }, delay);
      }
    },
    async getMax() {
      this.$store.commit("setInputSource", "from");
      let max;
      if (
        this.$store.state.fromToken.coinCode === "BNB(BSC)" ||
        this.$store.state.fromToken.coinCode === "ETH" ||
        this.$store.state.fromToken.coinCode === "HT(HECO)" ||
        this.$store.state.fromToken.coinCode === "MATIC(MATIC)" ||
        this.$store.state.fromToken.coinCode === "OKT" ||
        this.$store.state.fromToken.coinCode === "TT" ||
        this.$store.state.fromToken.coinCode === "XDC" ||
        this.$store.state.fromToken.coinCode === "ETH(ARB)" ||
        this.$store.state.fromToken.coinCode === "KLAY" ||
        this.$store.state.fromToken.coinCode === "CELO" ||
        this.$store.state.fromToken.coinCode === "HPB" ||
        this.$store.state.fromToken.coinCode === "AME" ||
        this.$store.state.fromToken.coinCode === "ECH" ||
        this.$store.state.fromToken.coinCode === "CUBE" ||
        this.$store.state.fromToken.coinCode === "GNOSIS" ||
        this.$store.state.fromToken.coinCode === "ETC" ||
        this.$store.state.fromToken.coinCode === "KCC" ||
        this.$store.state.fromToken.coinCode === "BRISE" ||
        this.$store.state.fromToken.coinCode === "CRO" ||
        this.$store.state.fromToken.coinCode === "ETHF" ||
        this.$store.state.fromToken.coinCode === "ETHW" ||
        this.$store.state.fromToken.coinCode === "ETH(Optimism)" ||
        this.$store.state.fromToken.coinCode === "DRAC" ||
        this.$store.state.fromToken.coinCode === "DOGE(DC)" ||
        this.$store.state.fromToken.coinCode === "FRZ" ||
        this.$store.state.fromToken.coinCode === "GPB(GRC30)" ||
        this.$store.state.fromToken.coinCode === "CORE(CORE)" ||
        this.$store.state.fromToken.coinCode === "MTR(MTR)" ||
        this.$store.state.fromToken.coinCode === "FIL(FVM)" ||
        this.$store.state.fromToken.coinCode === "EOS(EVM)" ||
        this.$store.state.fromToken.coinCode === "CFX(CFX)" ||
        this.$store.state.fromToken.coinCode === "AVAX(C-Chain)" ||
        this.$store.state.fromToken.coinCode === "PLS" ||
        this.$store.state.fromToken.coinCode === "MNT(MNT)" ||
        this.$store.state.fromToken.coinCode === "BNB(opBNB)"
      ) {
        
        let mainNetwork;
        if (this.connectType === "OKExWallet") {
          mainNetwork = okexchain;
        }else if (this.connectType === "OpenBlock") {
          mainNetwork = window.openblock;
        } else if (this.connectType === "EchoooWallet") {
          mainNetwork = window.echoooEth;
        } else if (this.connectType === "Nabox") {
          mainNetwork = NaboxWallet;
        } else if (this.connectType === "ONTO") {
          mainNetwork = ONTO;
        } else if (this.connectType === "oneKey") {
          mainNetwork = window.$onekey.ethereum;
        } else if (this.connectType === "CLVWallet") {
          mainNetwork = window.clover;
        } else if (this.connectType === "Halo") {
          mainNetwork = window.kucoin;
        } else if (this.connectType === "Crypto") {
          mainNetwork = window.deficonnectProvider;
        } else if (this.connectType === "Bitget") {
          mainNetwork = window.bitkeep.ethereum;
        } else if (this.connectType === "Patex") {
          mainNetwork = window.patex.ethereum;
        }else if(this.connectType === "JoyIDWallet"){
          const fee = await joyIdMethids.getMaxFees()
          max = this.$store.state.balance - fee
          max = max > 0 ? Number(max).toFixed(6, BigNumber.ROUND_DOWN) : 0;
          this.$store.commit("setFromNumber", max);
          return
        } else {
          mainNetwork = ethereum;
        }
        if (
          this.connectType === "walletConnect" ||
          (this.connectType == "imToken" && this.isPC)
        ) {
          WalletConnectProvider = await EthereumProvider.init(
            this.connectType == "imToken"
              ? this.$store.getters.EthereumProviderInitImtoken
              : this.$store.getters.EthereumProviderInit
          );
          provider = new ethers.providers.Web3Provider(
            WalletConnectProvider,
            "any"
          );
        } else {
          provider = new ethers.providers.Web3Provider(mainNetwork, "any");
        }

        const module = await import("web3");
        const Web3 = module.default;
        const web3 = new Web3(mainNetwork);

        const gp = Number(await provider.getGasPrice());
        const gasPrice =
          this.$store.state.fromToken.coinCode === "HT(HECO)" ||
          this.$store.state.fromToken.coinCode === "AVAX(C-Chain)" ||
          this.$store.state.fromToken.coinCode === "POLYGON"
            ? gp * 8
            : gp;
        const gasLimit = await web3.eth.estimateGas({
          from: this.walletAddress,
        });
        const fee = Number(
          new BigNumber(gasPrice)
            .multipliedBy(gasLimit)
            .dividedBy(BigNumber(10).pow(18))
            .toFixed(6)
        );

        const supportAmt = Number(this.$store.state.balance) - fee;
        max = supportAmt;
        // Number(this.info.depositMax) < supportAmt
        //   ? this.info.depositMax
        //   : supportAmt
      } else if (
        this.$store.state.fromToken.coinCode === "DOT" &&
        this.$store.state.chainId === "000"
      ) {
        max = (Number(this.$store.state.balance) - 0.025).toFixed(6);
      } else if (
        this.$store.state.fromToken.coinCode === "CRU" &&
        this.$store.state.chainId === "222"
      ) {
        max = (Number(this.$store.state.balance) - 0.00004).toFixed(6);
      } else if (
        this.$store.state.fromToken.coinCode === "DBC" &&
        this.$store.state.chainId === "333"
      ) {
        max = (Number(this.$store.state.balance) - 0.0025).toFixed(6);
      } else if (
        this.$store.state.fromToken.coinCode === "TRX" &&
        this.$store.state.chainId === "0"
      ) {
        max = Number(this.$store.state.balance) - 20;
      } else if (
        this.$store.state.fromToken.coinCode === "SOL" &&
        this.$store.state.chainId === "2021"
      ) {
        max = (Number(this.$store.state.balance) - 0.00001).toFixed(6);
      } else if (
        this.$store.state.fromToken.coinCode === "LUNA" &&
        this.$store.state.chainId === "1993"
      ) {
        max = (Number(this.$store.state.balance) - 0.003).toFixed(6);
      } else if (
        this.$store.state.fromToken.coinCode === "BTC" &&
        this.$store.state.chainId === "1994"
      ) {
        let gas = 0.00004;
        try {
          const result = await axios.get(
            "https://blockstream.info/api/fee-estimates"
          );
          const maxValue = Math.max(...Object.values(result));
          const num = Math.ceil(maxValue);
          gas = (num * 224) / 10 ** 8;
        } catch (err) {}
        max = (Number(this.$store.state.balance) - gas).toFixed(6);
        max = max > 0 ? Number(max).toFixed(6, BigNumber.ROUND_DOWN) : 0;
        if (max == 0) {
          Toast(this.$t("InsufficientBTC"));
        }
      } else if (
        this.$store.state.fromToken.coinCode === "XRP" &&
        this.$store.state.chainId === "1008600"
      ) {
        max = Number(this.$store.state.balance) - 0.02;
      } else if (
        this.$store.state.fromToken.coinCode === "APT" &&
        this.$store.state.chainId === "072611"
      ) {
        max = Number(this.$store.state.balance) - 0.03;
      } else if (
        this.$store.state.fromToken.coinCode === "AELF" &&
        this.$store.state.chainId === "520520"
      ) {
        max = Number(this.$store.state.balance) - 0.004;
      } else if (
        this.$store.state.fromToken.coinCode === "BTT(BTTC)" &&
        this.$store.state.chainId === "199"
      ) {
        max = Number(this.$store.state.balance) - 7;
      } else if (
        this.$store.state.fromToken.coinCode === "ETH(ZKSYNC)" &&
        this.$store.state.chainId === "324"
      ) {
        max = Number(this.$store.state.balance) - 0.0004;
      } else if (
        this.$store.state.fromToken.coinCode === "PG(PEGO)" &&
        this.$store.state.chainId === "20201022"
      ) {
        max = Number(this.$store.state.balance) - 0.2;
      } else if (
        this.$store.state.fromToken.coinCode === "DOGE" &&
        this.$store.state.chainId === "9666"
      ) {
        max = Number(this.$store.state.balance) - 0.1;
      } else if (
        this.$store.state.fromToken.coinCode === "SUI" &&
        this.$store.state.chainId === "7299"
      ) {
        max = max = Number(this.$store.state.balance) - 0.008;
      } else if (
        this.$store.state.fromToken.coinCode === "FIL" &&
        this.$store.state.chainId === "1200"
      ) {
        max = max = Number(this.$store.state.balance) - 0.05;
      } else if (
        this.$store.state.fromToken.coinCode === "SEI" &&
        this.$store.state.chainId === "1333"
      ) {
        max = max = Number(this.$store.state.balance) - 0.15;
      } else if (
        this.$store.state.fromToken.coinCode === "HVH(HVH)" &&
        this.$store.state.chainId === "6000"
      ) {
        max = max = Number(this.$store.state.balance) - 0.01;
      } else {
        max = this.$store.state.balance;
      }
      max = max > 0 ? Number(max).toFixed(6, BigNumber.ROUND_DOWN) : 0;
      this.$store.commit("setFromNumber", max);
    },
    choiceCoin() {
      this.$refs.coinList.$refs.dialog.show = true;
    },
    stopScrollFun(evt) {
      evt = evt || window.event;
      if (evt.preventDefault) {
        // Firefox
        evt.preventDefault();
        evt.stopPropagation();
      } else {
        // IE
        evt.cancelBubble = true;
        evt.returnValue = false;
      }
      return false;
    },
    openAcct(val) {
      this.allAccountsSS58 = val;
      if (this.type == "from") {
        this.$nextTick(() => {
          this.$bus.emit("openAcctdialog", val);
        });
      }
    },
    checkPolk(val) {
      this.$bus.emit("getPolkadot", val);
    },
    async getUsdtRate() {
      const data = {
        depositCoinCode: this.token.coinCode,
        receiveCoinCode: "USDT(TRON)",
        walletAddress: this.walletAddress,
        depositCoinAmt: "1",
      };
      const res = await baseApi.getBaseInfo(data);
      if (res.resCode == "800") {
        if (this.type === "from") {
          this.depositUSDTRate = res.data.instantRateOriginal;
          if (this.number != "") {
            this.depositUsdtAmt = new BigNumber(this.depositUSDTRate)
              .multipliedBy(BigNumber(this.number))
              .toFixed(6, BigNumber.ROUND_DOWN);
          }
        }
        if (this.type === "to") {
          this.receiveUSDTRate = res.data.instantRateOriginal;
          if (this.number != "") {
            this.receiveUsdtAmt = new BigNumber(this.receiveUSDTRate)
              .multipliedBy(BigNumber(this.number))
              .toFixed(6, BigNumber.ROUND_DOWN);
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.trade-box {
  box-sizing: border-box;
  width: 100%;
  .top {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    img {
      height: 0.851rem;
      width: 0.851rem;
      padding-right: 10px;
      position: relative;
      top: -1px;
    }
    .coin-info {
      flex: 1;
      height: 0.66rem;
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.66rem;
        height: 0.66rem;
        .coin-name {
          flex: 1;
          text-align: left;
          font-size: 0.33rem;
          border: none;
          width: calc(100% - 0.37rem);
          cursor: pointer;
          &::placeholder {
            color: #000;
          }
          &::-moz-placeholder {
            color: #000;
          }
          &::-webkit-input-placeholder {
            color: #000;
          }
        }
        svg {
          width: 0.37rem;
          height: 0.37rem;
          border-radius: 5px;
        }
      }
      /* .balance {
        text-align: left;
        font-family: Poppins-Medium, Poppins;
        font-weight: 500;
        color: #6b6c70;
        font-size: 8px;
        -webkit-text-size-adjust: none;
      } */
    }
  }
  .xian {
    width: 98%;
    margin: 0.33rem auto;
    height: 2px;
    background: #fbfbfd;
    // border: 1px solid #FBFBFD;
  }
  .bottom {
    box-sizing: border-box;
    width: 100%;
    // height: 120px;
    border-radius: 17px;
    border: 1px solid #f2f5fa;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    .bottomInner {
      width: calc(100% - 20px);
      // height: 65px;
      padding: 10px;
      background: #f7f8fa;
      border-radius: 16px;
      .tip {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.37rem;
        line-height: 0.55rem;
        font-size: 12px;
        font-family: Poppins-Medium;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        .type {
          color: #6b6c70;
        }
      }
      .input_view {
        width: 100%;
        display: flex;
        // margin-top: 3px;
        //justify-content: space-between;
        //text-align: center;
        .number {
          height: 25px;
          width: 100%;
          border: none;
          font-size: 18px;
          font-family: Poppins;
          background: #f7f8fa;
          :deep(.el-input) {
            .el-input__inner {
              height: 25px;
              line-height: 25px;
              width: 100%;
              border: none;
              font-size: 18px;
              font-family: Poppins;
              background: #f7f8fa;
              padding: 0;
              &::-webkit-input-placeholder {
                color: #aab0c8;
              }
            }
            .el-input__suffix {
              display: none;
            }
          }
          &::placeholder {
            color: #aab0c8;
          }
          &::-moz-placeholder {
            color: #aab0c8;
          }
          &::-webkit-input-placeholder {
            color: #aab0c8;
          }
        }

        .max {
          font-size: 12px;
          -webkit-text-size-adjust: none;
          font-family: PingFangSC-Heavy, PingFang SC;
          font-weight: 800;
          color: #fff;
          width: 35px;
          height: 14px;
          padding: 2px 7px;
          border-radius: 5px;
          line-height: 14px;
          margin-top: 4px;
          cursor: pointer;
        }
      }
      .number-color {
        color: #333 !important;
      }
      .USDTAmount {
        height: 20px;
        color: #aab0c8;
        text-align: left;
        font-family: Inter-Regular, Inter;
        font-weight: 400;
      }
    }
    .range {
      width: calc(100% - 10px);
      padding-left: 5px;
      color: #000;
      font-size: 10px;
      color: #aab0c8;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 16px;
      text-align: left;
      height: auto;
      min-height: 25px;
      overflow-x: auto;
    }
  }
}
</style>
