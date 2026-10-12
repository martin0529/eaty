-- 3 個食堂的簡介改為「電話 + 付款方式」（2026-10-12）
-- 來源：https://www.cityu.edu.hk/zh-hk/directories/catering
-- 可重複執行。

update canteens set
  fact_zh = '電話 +852 2971-0668・付款：現金／信用卡／八達通／AlipayHK／Apple Pay／BoC Pay／PayMe／WeChat Pay HK',
  fact_en = 'Tel +852 2971-0668 · Payment: Cash / Credit Card / Octopus / AlipayHK / Apple Pay / BoC Pay / PayMe / WeChat Pay HK'
where id = 'ac1';

update canteens set
  fact_zh = '電話 +852 2312-7928・付款：現金／信用卡／八達通／AlipayHK／Apple Pay／BoC Pay／PayMe／Union Pay／WeChat Pay HK',
  fact_en = 'Tel +852 2312-7928 · Payment: Cash / Credit Card / Octopus / AlipayHK / Apple Pay / BoC Pay / PayMe / UnionPay / WeChat Pay HK'
where id = 'ac2';

update canteens set
  fact_zh = '電話 +852 4683-4908・付款：現金／信用卡／八達通／AlipayHK／WeChat Pay HK',
  fact_en = 'Tel +852 4683-4908 · Payment: Cash / Credit Card / Octopus / AlipayHK / WeChat Pay HK'
where id = 'ac3';
