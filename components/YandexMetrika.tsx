"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";

const YM_COUNTER_ID = 109058765;
const CONSENT_KEY = "cookie_consent";

const metrikaInit = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${YM_COUNTER_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,ecommerce:"dataLayer"});`;

function subscribeConsent(onStoreChange: () => void) {
  const onConsent = () => onStoreChange();
  window.addEventListener("ksd-cookie-consent", onConsent);
  return () => window.removeEventListener("ksd-cookie-consent", onConsent);
}

function getConsentSnapshot() {
  return localStorage.getItem(CONSENT_KEY) === "true";
}

function getConsentServerSnapshot() {
  return false;
}

export default function YandexMetrika() {
  const enabled = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  if (!enabled) return null;

  return (
    <>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${YM_COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: metrikaInit }}
      />
    </>
  );
}
