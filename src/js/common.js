'use strict';

(function () {
  /**
   * DOM
   */
  const header = document.querySelector('.js-header');
  const headerHeight = header.offsetHeight;
  const fixedHeader = document.querySelector('.js-fixed-header');
  const hamburger = document.querySelector('.js-hamburger');
  const fhHamburger = document.querySelector('.js-fixed-header-hamburger');
  const drawer = document.querySelector('.js-drawer');
  const fhDrawer = document.querySelector('.js-fixed-header-drawer');
  const mainVisual = document.querySelector('.js-main-visual');
  const mvHeight = mainVisual.offsetHeight;
  const btnToTop = document.querySelector('.js-button-to-top');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const anchorLinksArr = Array.prototype.slice.call(anchorLinks);
  const loading = document.querySelector('.js-loading');
  const animeTargets = document.querySelectorAll('.js-anime-target');

  /**
   * 関数
   */
  // 固定ヘッダーの表示・非表示
  const fixedHeaderToggle = function () {
    if (window.pageYOffset > mvHeight + headerHeight) {
      fixedHeader.classList.add('is-show');
    } else {
      fixedHeader.classList.remove('is-show');
    }
  }
  // ハンバーガーメニューを開く
  const hamburgerOpen = function (burger, drawer) {
    burger.classList.add('is-open');
    drawer.classList.add('is-open');
    bodyScrollLock.disableBodyScroll(drawer);
  }
  // ハンバーガーメニューを閉じる
  const hamburgerClose = function (burger, drawer) {
    burger.classList.remove('is-open');
    drawer.classList.remove('is-open');
    bodyScrollLock.clearAllBodyScrollLocks();
  }
  // ターゲット要素へのスムーススクロール
  const scrollToTarget = function (targetId) {
    if (targetId === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      const target = document.querySelector(targetId);
      const targetPosition = window.pageYOffset + target.getBoundingClientRect().top - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }
  // トップへ戻るボタンの表示・非表示
  const btnToTopToggle = function () {
    if (window.pageYOffset > 300) {
      btnToTop.classList.add('is-show');
    } else {
      btnToTop.classList.remove('is-show');
    }
  }
  // ページトップへ戻る動き
  const scrollToTop = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /**
   * イベント
   */
  // 固定ヘッダーの表示・非表示
  window.addEventListener('scroll', fixedHeaderToggle);
  // ハンバーガーメニューの開閉
  hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('is-open')) {
      hamburgerClose(hamburger, drawer);
    } else {
      hamburgerOpen(hamburger, drawer);
    }
  });
  // ハンバーガーメニューの開閉（固定ヘッダー）
  fhHamburger.addEventListener('click', function () {
    if (fhHamburger.classList.contains('is-open')) {
      hamburgerClose(fhHamburger, fhDrawer);
    } else {
      hamburgerOpen(fhHamburger, fhDrawer);
    }
  });
  // 画面が768px以上にリサイズされた時にハンバーガーメニューを閉じる
  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 768px)').matches) {
      if (window.pageYOffset > headerHeight + mvHeight) {
        hamburgerClose(fhHamburger, fhDrawer);
      } else {
        hamburgerClose(hamburger, drawer);
      }
    }
  })
  // アンカーリンクをクリックすることによるターゲット要素へのスムーススクロール
  anchorLinksArr.forEach(elm => {
    elm.addEventListener('click', function (e) {
      e.preventDefault();
      let targetId = elm.getAttribute('href');
      if (elm.closest('.js-drawer')) {
        hamburger.click();
      } else if (elm.closest('.js-fixed-header-drawer')) {
        fhHamburger.click();
      }
      scrollToTarget(targetId);
    });
  });
  // ウィンドウのスクロールによるトップへ戻るボタンの表示・非表示
  window.addEventListener('scroll', btnToTopToggle);
  // トップへ戻るボタンのクリックによりページトップへ戻る
  btnToTop.addEventListener('click', scrollToTop);

  /**
   * Swiper
   */
  const homeMvSlider = new Swiper('.js-home-main-visual-slider', {
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    loop: true,
    speed: 2000,
  });
  homeMvSlider.autoplay.stop();

  /**
   * ローディング画面(sessionStorage)
   */
  const loadedPage = function () {
    loading.classList.add("is-loaded");
    homeMvSlider.autoplay.start();
  }

  if (!sessionStorage.getItem('visited')) {
    sessionStorage.setItem('visited', 'first');
    window.addEventListener('load', function () {
      setTimeout(loadedPage, 2000);
    });
    setTimeout(loadedPage, 4000);
  } else {
    loadedPage();
  }

  /**
   * スクロールアニメーション(Intersection Observer)
   */
  // 監視する要素が画面と交差した時に発動させる処理
  function callback(entries, obs) {
    entries.forEach(entry => {
      // 監視する要素と画面との交差が終わったら処理を発動させない
      if (!entry.isIntersecting) {
        return;
      }
      // 監視する要素が画面と交差している時に以下の処理を発動させる
      entry.target.classList.add('is-appear');
      // 処理が終わったら監視を止める
      obs.unobserve(entry.target);
    });
  }
  // オプション
  const options = {
    root: null, // 監視する領域を指定。初期値nullはviewport全体
    rootMargin: '0px 0px', // 監視する領域の広さを指定
    threshold: 0.5, // 監視している要素が画面と何%交差した時に処理を実行するかを指定
  }
  // Intersection Observerのインスタンスを作成
  const observer = new IntersectionObserver(callback, options);
  // アニメーション対象の要素を監視する
  animeTargets.forEach(target => {
    observer.observe(target);
  });
})();
