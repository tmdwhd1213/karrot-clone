# 당근 클론

# Next.js는 build할 때 static, dynamic 페이지로 나누는데, 그 기준은 쿠키를 쓰느냐?

# 만약 안 쓴다면, 사용자에 따라 페이지를 다르게 보여주느냐?로 나누고 헤더도 안 바뀌고 그러면

# static(정적)페이지로 build하고 production mode로 실행하면 (npm run start) 단순 HTML 페이지로 생성된다.

# (아무리 db를 조회하고 async로 비동기 함수를 쓴다하더라도...)

# Route Segment Config (https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

- 몰랐던 것.
  1. dev모드에서는 모든 페이지가 dynamic처럼 작동한다. (따라서 static처럼 구현하기 위해 unstable_cache를 사용)
  2. generateStaticParams 함수는 Next.js에서 지정한 함수로 Array를 리턴해야함. (ex. productDetail 함수가 받을 가능성이 있는 parameter들이 들어있는 Array)

# Optimistic Response

- 마치 백엔드에서 mutation(사용자가 데이터를 보내면 db에서 수정, 생성 등의 액션을 하는 것)이 성공한 것처럼 UI를 수정하는 것 -> (React의 useOptimistic hook 이용)
