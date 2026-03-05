(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=a(r);fetch(r.href,i)}})();const Zt="a",Ht=8e4,_t={min:0,max:3e5,step:100},Xt={incomeMonthsFactor:8,minEquity:2e4,maxTotalInvestmentRatio:.4},ea={rentPerSqm:19.25,ancillaryCostRate:.085,vacancyRate:0,monthlyManagementFlat:70,monthlyMaintenanceFlat:30,purchaseYear:2027,rentStartYear:2028,rentStartQuarter:4,afaStartYear:2028,afaStartQuarter:4,kfwLoanAmount:15e4,kfwInterestRate:.029,kfwRepaymentRate:.024,kfwGraceYears:3,kfwGrantAmount:15e3,bankInterestRate:.0485,bankRepaymentRate:.02,monumentShare:.72,annualGrowthRate:.02,years:20,afaSchedule:[{startYear:1,endYear:8,rate:.09},{startYear:9,endYear:12,rate:.07}]},ta=[{maxMonthlyIncome:2800,rate:.24},{maxMonthlyIncome:3800,rate:.29},{maxMonthlyIncome:5200,rate:.34},{maxMonthlyIncome:7e3,rate:.38},{maxMonthlyIncome:999999,rate:.42}],aa=[{id:"a",label:"Apartment A",subtitle:"1-Zimmer, ca. 27 m2",size:27,purchasePrice:21e4,image:"/floorplans/apartment-a.png",monthlyManagement:55,monthlyMaintenance:60,monthlyOtherCost:20},{id:"b",label:"Apartment B",subtitle:"2-Zimmer, ca. 35 m2",size:35,purchasePrice:275e3,image:"/floorplans/apartment-b.png",monthlyManagement:65,monthlyMaintenance:75,monthlyOtherCost:25}],na={defaultApartmentId:Zt,defaultAnnualGrossIncome:Ht,incomeBounds:_t,equityModel:Xt,assumptions:ea,taxBrackets:ta,apartments:aa},Z="york-living-runtime-config",Be=se(na),g=Ka(Be),ut=Fa(),Le=g.apartments,s=g.assumptions,B=s.years,T={min:-2,max:5,step:.1},M={min:0,max:3e4,step:500},nt=.03,ia=.02,j=[{image:"/project/hero-york-living-tomorrow.png",alt:"York Living morgen",caption:"York Living morgen"},{image:"/project/hero-modern-living.png",alt:"Modern Living",caption:"Modern Living"},{image:"/project/hero-york-today.png",alt:"York Quartier heute",caption:"York Quartier heute"},{image:"/project/hero-bike-city.png",alt:"Muenster, die Fahrrad-Stadt",caption:"Muenster, die Fahrrad-Stadt"}],ra=l("app");ra.innerHTML=`
  <details class="config-menu">
    <summary class="config-toggle">Parameter</summary>
    <div class="config-panel">
      <div class="config-panel-header">
        <div>
          <p class="config-panel-title">Rechenparameter</p>
          <p class="config-panel-copy">
            Zins, Tilgung, Kaufpreis und Steuerannahmen direkt im UI anpassen. Aenderungen gelten
            lokal in diesem Browser, bis du sie zuruecksetzt.
          </p>
        </div>
      </div>

      <form id="config-form" class="config-form" autocomplete="off">
        <div class="config-section-list">${ja(ut,g)}</div>
      </form>

      <div class="config-actions">
        <button id="apply-config" class="btn btn-primary btn-compact" type="button">Uebernehmen</button>
        <button id="reset-config" class="btn btn-secondary btn-compact" type="button">Zuruecksetzen</button>
        <button id="copy-config" class="btn btn-secondary btn-compact" type="button">Backup JSON</button>
      </div>

      <p id="config-status" class="config-status" role="status" aria-live="polite"></p>
    </div>
  </details>

  <main class="page">
    <section class="panel hero">
      <div class="hero-visual">
        <div id="hero-slideshow" class="hero-slideshow">
          <img
            id="hero-slide-image"
            src="${Ge(j[0].image)}"
            alt="${j[0].alt}"
          />
          <div class="hero-slide-overlay">
            <p id="hero-slide-caption" class="hero-slide-caption">${j[0].caption}</p>
            <div class="hero-slide-controls">
              <button
                id="hero-slide-prev"
                class="hero-slide-nav"
                type="button"
                aria-label="Vorheriges Projektbild"
              >
                ‹
              </button>
              <button
                id="hero-slide-next"
                class="hero-slide-nav"
                type="button"
                aria-label="Naechstes Projektbild"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-content">
        <p class="eyebrow">York Living Muenster</p>
        <h1>Dein Immobilien-Check in 60 Sekunden</h1>
        <p class="lead">
          Waehle einen Grundriss, gib dein Bruttojahreseinkommen ein und erhalte sofort eine
          transparente ${B}-Jahres-Prognose fuer dein moegliches Vermoegen.
        </p>
        <div class="hero-actions">
          <a
            class="btn btn-secondary btn-link"
            href="https://maps.app.goo.gl/t3fVRBvNyz42xWMp7"
            target="_blank"
            rel="noreferrer noopener"
          >
            Lage auf Google Maps
          </a>
          <button id="copy-scenario-link" class="btn btn-primary" type="button">Szenario-Link kopieren</button>
        </div>
        <p id="share-status" class="share-status" role="status" aria-live="polite"></p>
      </div>
    </section>

    <section class="workspace">
      <section class="panel choose-panel">
        <h2>1. Waehle deine Wohnungsoption</h2>
        <div id="apartment-options" class="apartment-options"></div>

        <div class="income-block">
          <h2>2. Dein Bruttojahreseinkommen</h2>
          <div class="income-row">
            <label class="field field-income-compact" for="annual-gross-income">
              <span>Bruttojahreseinkommen (EUR)</span>
              <input
                id="annual-gross-income"
                type="number"
                min="${g.incomeBounds.min}"
                max="${g.incomeBounds.max}"
                step="${g.incomeBounds.step}"
                inputmode="decimal"
              />
            </label>

            <fieldset class="field field-tax-mode">
              <legend>Steuertarif</legend>
              <div class="tax-mode-switch" role="radiogroup" aria-label="Steuertarif waehlen">
                <label class="tax-mode-option" for="tax-mode-grund">
                  <input id="tax-mode-grund" type="radio" name="tax-table-mode" value="grund" />
                  <span>Grundtabelle</span>
                </label>
                <label class="tax-mode-option" for="tax-mode-splitting">
                  <input id="tax-mode-splitting" type="radio" name="tax-table-mode" value="splitting" />
                  <span>Splitting</span>
                </label>
              </div>
            </fieldset>
          </div>

          <label class="field" for="growth-rate">
            <span>Gemeinsame Wertentwicklung Objektwert + Miete (pro Jahr)</span>
            <input
              id="growth-rate"
              type="range"
              min="${T.min}"
              max="${T.max}"
              step="${T.step}"
            />
            <strong id="out-growth-rate" class="slider-value">-</strong>
          </label>

          <label class="field" for="equity-amount">
            <span>Eingesetztes Eigenkapital</span>
            <input
              id="equity-amount"
              type="range"
              min="${M.min}"
              max="${M.max}"
              step="${M.step}"
            />
            <strong id="out-equity-amount" class="slider-value">-</strong>
          </label>
        </div>
      </section>

      <section class="panel result-panel" aria-live="polite">
        <p class="eyebrow">3. Prognose</p>
        <h2 id="result-headline">Dein moegliches Vermoegen nach ${B} Jahren</h2>
        <p id="out-wealth20" class="wealth-value">-</p>
        <p id="out-wealth-gain" class="wealth-subvalue">-</p>

        <div class="metric-grid">
          <article class="metric-card">
            <p class="metric-label">Objektwert in ${B} Jahren</p>
            <p id="out-object-value" class="metric-value">-</p>
          </article>
          <article class="metric-card">
            <p class="metric-label">Kumulierter Cashflow (${B} Jahre)</p>
            <p id="out-cashflow20" class="metric-value">-</p>
          </article>
        </div>

        <div class="liquidity-block">
          <div class="liquidity-head">
            <p class="assumption-label">Monatliche Liquiditaet ueber ${B} Jahre</p>
            <div class="liquidity-head-actions">
              <button
                id="liquidity-view-prev"
                class="liquidity-view-nav"
                type="button"
                aria-label="Vorherige Liquiditaetsansicht"
              >
                ‹
              </button>
              <p id="liquidity-mode" class="liquidity-mode">Nach Steuern</p>
              <button
                id="liquidity-view-next"
                class="liquidity-view-nav"
                type="button"
                aria-label="Naechste Liquiditaetsansicht"
              >
                ›
              </button>
            </div>
          </div>
          <div id="liquidity-view-content" class="liquidity-view-content"></div>
        </div>

        <div class="progress-wrap">
          <div class="progress-meta">
            <p>Vermoegensentwicklung ueber ${B} Jahre</p>
            <p id="out-path-end">-</p>
          </div>
          <div id="wealth-path" class="wealth-path"></div>
        </div>

        <div class="assumption-grid">
          <article>
            <p class="assumption-label">Eigenkapital fuer Nebenkosten</p>
            <p id="out-start-equity">-</p>
          </article>
          <article>
            <p class="assumption-label">Gesamtinvestition inkl. Nebenkosten</p>
            <p id="out-total-investment">-</p>
          </article>
          <article>
            <p id="out-tax-label" class="assumption-label">Steuer laut Grundtabelle</p>
            <p id="out-tax-rate">-</p>
          </article>
          <article>
            <p class="assumption-label">Restschuld bei Refinanzierung (Ende Jahr 12)</p>
            <p id="out-refinance-debt">-</p>
          </article>
        </div>
      </section>
    </section>

    <section class="panel contact-panel" aria-labelledby="contact-title">
      <h2 id="contact-title">Ich bin interessiert!</h2>
      <p class="lead">
        Mit einem Klick koennen Sie direkt per E-Mail um Rueckruf bitten, sofort telefonisch
        Kontakt aufnehmen oder direkt einen Termin buchen.
      </p>
      <div class="contact-actions">
        <a
          id="contact-mail-link"
          class="btn btn-primary btn-link"
          href="mailto:andreas.peters@mlp.de"
          aria-label="Beratungsgespraech per E-Mail anfordern"
        >
          Beratung per Mail anfordern
        </a>
        <a
          class="btn btn-secondary btn-link"
          href="tel:+4915119690871"
          aria-label="Jetzt anrufen unter 0151 19690871"
        >
          Direkt anrufen: 0151/19690871
        </a>
        <a
          class="btn btn-secondary btn-link"
          href="https://mlp-onlineberatung.flexperto.com/expert?id=782"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Direkte Terminbuchung in neuem Tab oeffnen"
        >
          Direkte Terminbuchung
        </a>
      </div>
      <p class="small-note">
        Wenn Sie Unterstuetzung bei den Eingaben wuenschen, rufen Sie gern an oder senden Sie
        eine kurze E-Mail.
      </p>
    </section>

    <section class="panel facts-panel">
      <h2>Ein paar schnelle Fakten über Münster.</h2>
      <p class="lead">
        Diese Kennzahlen zeigen vor allem eines: Münster verbindet knappen Wohnraum, hohe Nachfrage
        nach kompakten Apartments und eine Lage mit kurzen Wegen in die
        Innenstadt.
      </p>
      <div class="facts-grid">
        <article class="fact-card">
          <p class="fact-number">30.000</p>
          <p class="fact-title">zusaetzliche Wohnungen bis 2040</p>
          <div class="fact-bar">
            <div class="fact-fill fact-fill-demand" style="width: 18%"></div>
          </div>
          <p class="fact-copy">Das entspricht rund 18 % des Bestands von 2022.</p>
        </article>

        <article class="fact-card">
          <p class="fact-number">55,3 %</p>
          <p class="fact-title">Einpersonen-Haushalte (2024)</p>
          <div class="compare-row">
            <span>2011: 53,0 %</span>
            <span>2024: 55,3 %</span>
          </div>
          <div class="fact-bar">
            <div class="fact-fill fact-fill-single" style="width: 55.3%"></div>
          </div>
        </article>

        <article class="fact-card">
          <p class="fact-number">1,1 %</p>
          <p class="fact-title">Leerstand aktuell</p>
          <div class="compare-row">
            <span>Ist: 1,1 %</span>
            <span>Soll: 3,0 %</span>
          </div>
          <div class="dual-bars">
            <div class="dual-bar">
              <span style="width: 36.7%"></span>
            </div>
            <div class="dual-bar dual-bar-target">
              <span style="width: 100%"></span>
            </div>
          </div>
        </article>

        <article class="fact-card">
          <p class="fact-number">15-20 min</p>
          <p class="fact-title">Fahrzeit zur Innenstadt</p>
          <p class="fact-copy">Ca. 6,5 km bis Domplatz per Rad oder Auto laut Broschuere.</p>
          <p class="fact-copy">Ein Ort, der Investment und Lebensqualitaet zusammenbringt.</p>
        </article>
      </div>
    </section>
  </main>

  <div id="liquidity-modal" class="liquidity-modal" aria-hidden="true">
    <div class="liquidity-modal-backdrop" data-liquidity-modal-close="true"></div>
    <section
      class="liquidity-modal-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="liquidity-modal-title"
    >
      <header class="liquidity-modal-head">
        <div>
          <p class="eyebrow">Detailansicht</p>
          <h3 id="liquidity-modal-title">Jaehrliche Einnahmen und Ausgaben</h3>
        </div>
        <div class="liquidity-modal-actions">
          <button
            id="liquidity-modal-cycle"
            type="button"
            class="liquidity-inline-toggle"
            aria-label="Zur naechsten Grafikansicht wechseln"
          >
            Zur Grafik
          </button>
          <button
            id="liquidity-modal-close"
            type="button"
            class="liquidity-view-nav"
            aria-label="Detailansicht schliessen"
          >
            ×
          </button>
        </div>
      </header>
      <div id="liquidity-modal-content" class="liquidity-modal-content"></div>
    </section>
  </div>
`;const sa=new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}),oa=new Intl.NumberFormat("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1}),it=l("apartment-options"),Se=l("annual-gross-income"),mt=Array.from(document.querySelectorAll('input[name="tax-table-mode"]')),Me=l("growth-rate"),xe=l("equity-amount"),la=l("share-status"),dt=l("config-form"),rt=l("config-status"),ca=l("liquidity-mode"),qe=l("liquidity-view-prev"),$e=l("liquidity-view-next"),Ie=l("liquidity-view-content"),ua=l("apply-config"),ma=l("reset-config"),da=l("copy-config"),pa=l("copy-scenario-link"),ha=l("contact-mail-link"),le=l("hero-slideshow"),st=l("hero-slide-image"),fa=l("hero-slide-caption"),ga=l("hero-slide-prev"),ya=l("hero-slide-next"),H=l("liquidity-modal"),ba=l("liquidity-modal-content"),wa=l("liquidity-modal-close"),ka=l("liquidity-modal-cycle");let v=g.defaultApartmentId,z="grund",R=g.defaultAnnualGrossIncome,A=s.annualGrowthRate*100,x=Te(v),L="afterTaxChart",Re=0,Q=null,Ae=null,_=!1;Aa();pt();bt();Ea(R);Ba(A);La(x);wt();ce();Ja()&&D("Lokale Konfigurationsaenderungen sind aktiv.");E();Se.addEventListener("input",()=>{R=I(N(Se.value,R),g.incomeBounds.min,g.incomeBounds.max),E()});mt.forEach(e=>{e.addEventListener("change",()=>{$t(e.value)&&(z=e.value,bt(),E())})});Me.addEventListener("input",()=>{A=I(N(Me.value,A),T.min,T.max),E()});xe.addEventListener("input",()=>{x=I(N(xe.value,x),M.min,M.max),E()});pa.addEventListener("click",async()=>{const e=yt(v,z,R,A,x),t=await At(e);Ya(t?"Szenario-Link mit Wohnungswahl und Einkommen wurde kopiert.":"Szenario-Link konnte nicht automatisch kopiert werden.")});ga.addEventListener("click",()=>{ze(-1),kt()});ya.addEventListener("click",()=>{ze(1),kt()});le.addEventListener("mouseenter",Pe);le.addEventListener("mouseleave",ce);le.addEventListener("focusin",Pe);le.addEventListener("focusout",ce);wa.addEventListener("click",()=>{ee()});ka.addEventListener("click",()=>{Ye(),ee(),E()});H.addEventListener("click",e=>{const t=e.target;!(t instanceof HTMLElement)||!t.closest('[data-liquidity-modal-close="true"]')||ee()});document.addEventListener("keydown",e=>{e.key!=="Escape"||!_||ee()});qe.addEventListener("click",()=>{Ia(),E()});$e.addEventListener("click",()=>{Ye(),E()});Ie.addEventListener("click",e=>{const t=e.target;if(!(t instanceof HTMLElement))return;if(t.closest('[data-liquidity-open-table="true"]')&&Ae){ht(Ae);return}t.closest('[data-liquidity-cycle="true"]')&&(Ye(),E())});ua.addEventListener("click",()=>{try{const e=Mt(dt);Wa(e),D("Konfiguration gespeichert. Seite wird neu geladen."),window.setTimeout(()=>window.location.reload(),250)}catch(e){const t=e instanceof Error?e.message:"Unbekannter Fehler";D(`Konfiguration konnte nicht gespeichert werden: ${t}`,!0)}});ma.addEventListener("click",()=>{Oa(),D("Lokale Konfiguration entfernt. Seite wird neu geladen."),window.setTimeout(()=>window.location.reload(),250)});da.addEventListener("click",async()=>{try{const e=Mt(dt),t=await At(xt(e));D(t?"Konfigurations-Backup wurde als JSON kopiert.":"Backup konnte nicht automatisch kopiert werden.",!t)}catch(e){const t=e instanceof Error?e.message:"Unbekannter Fehler";D(`Konfiguration ist noch nicht gueltig: ${t}`,!0)}});function pt(){it.innerHTML=Le.map(e=>{const t=e.id===v?" apartment-card-active":"",a=`
        <p class="apartment-title">${e.label}</p>
        <p class="apartment-subtitle">${e.subtitle}</p>
      `;return`
        <button
          type="button"
          class="apartment-card${t}"
          data-apartment="${e.id}"
          aria-pressed="${e.id===v}"
        >
          <div class="apartment-image-wrap">
            <img src="${Ge(e.image)}" alt="Grundriss ${e.label}" />
          </div>
          <div class="apartment-info">
            ${a}
            <p class="apartment-price">${h(e.purchasePrice)}</p>
          </div>
        </button>
      `}).join(""),it.querySelectorAll(".apartment-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.apartment;!t||!X(t)||(v=t,pt(),E())})})}function E(){const e=vt(v),t=A/100,a=va(e,R,t,x,z);Ae=a;const n=yt(v,z,R,A,x);b("result-headline",`Dein moegliches Vermoegen nach ${B} Jahren mit ${e.label}`),b("out-wealth20",h(a.wealth20)),b("out-wealth-gain",`Vermoegenszuwachs ggü. Startkapital: ${w(a.wealthGain20)}`),b("out-object-value",h(a.projectedValue20)),b("out-cashflow20",w(a.cumulativeCashflow20)),b("out-growth-rate",`${It(a.annualGrowthRate*100)} % pro Jahr`),b("out-equity-amount",h(a.startEquity)),b("out-path-end",h(a.wealth20)),b("out-start-equity",h(a.startEquity)),b("out-total-investment",`${h(a.totalInvestment)} (inkl. ${h(a.ancillaryCosts)} Nebenkosten = ${oe(s.ancillaryCostRate*100)} %)`),b("out-tax-rate",`${h(a.annualTax)} p.a. | Grenzsteuersatz ${oe(a.marginalTaxRate*100)} %`),b("out-tax-label",`Steuer laut ${St(a.taxTableMode)}`),b("out-refinance-debt",h(a.refinanceDebtBase)),Ma(a),Sa(a.yearlyWealthPath),za(a,n),Ra()}function va(e,t,a,n,r){const i=e.size*s.rentPerSqm*12,c=s.monthlyManagementFlat*12,k=s.monthlyMaintenanceFlat*12,u=t*.8,C=Ee(u,r),G=Ga(u,r),V=e.purchasePrice*s.ancillaryCostRate,m=e.purchasePrice+V,f=I(n,M.min,Math.min(M.max,m)),ue=Math.max(m-f,0),F=Math.min(ue,s.kfwLoanAmount),me=Math.max(ue-F,0),Et=F>0?Math.min(s.kfwGrantAmount,F):0,de=Math.max(F-Et,0),pe=me,Ve=de+pe,Bt=de*(s.kfwInterestRate+s.kfwRepaymentRate),Lt=pe*(s.bankInterestRate+s.bankRepaymentRate),Yt=lt(Ta()),he=Ca(),zt=lt(he),Pt=-((F*.5*s.kfwInterestRate+me*.5*s.bankInterestRate)/12);let K=de,W=pe,q=Ve,Fe=0,je=0,O=0,Ne=0,De=0,Ke=0,fe=0,ge=0,ye=0;const We=[],Oe=[];for(let y=1;y<=s.years;y+=1){const Dt=Ce(y),$=Va(y),Qe=1-$;let te=0,be=0,ae=0,we=0,ne=0,ie=0,re=0;if(y===he+1&&(q=K+W,Fe=q,je=q*(nt+ia)),y<=he){const tt=K*s.kfwInterestRate,Ot=y<=s.kfwGraceYears?0:Math.min(Math.max(Bt-tt,0),K),at=W*s.bankInterestRate,Jt=Math.min(Math.max(Lt-at,0),W),Ut=F*.5*s.kfwInterestRate*Qe,Qt=me*.5*s.bankInterestRate*Qe;be=Ut+tt*$,ae=Ot*$,we=Qt+at*$,ne=Jt*$,te=be+ae+we+ne,K-=ae,W-=ne,q=K+W}else ie=q*nt,re=Math.min(Math.max(je-ie,0),q),te=ie+re,q-=re;const ke=i*Math.pow(1+a,y-1)*$,Ze=ke*s.vacancyRate,Kt=Ze+c*$+k*$,He=ke-Kt,Wt=Pa(y),_e=e.purchasePrice*s.monumentShare*Wt*G,J=He-te+_e;O+=J,y<=Yt?(Ne+=J,fe+=1):y<=zt?(De+=J,ge+=1):(Ke+=J,ye+=1);const Xe=e.purchasePrice*Math.pow(1+a,y),et=Xe-q+O;We.push(et),Oe.push({year:y,calendarYear:Dt,propertyValue:Xe,grossRent:ke,vacancyCost:Ze,managementCost:c*$,maintenanceCost:k*$,netBeforeDebt:He,kfwInterest:be,kfwPrincipal:ae,bankInterest:we,bankPrincipal:ne,refinanceInterest:ie,refinancePrincipal:re,debtService:te,taxBenefit:_e,cashflow:J,cumulativeCashflow:O,remainingDebt:q,netWealth:et})}const Je=e.purchasePrice*Math.pow(1+a,s.years),Ue=Je-q+O,Tt=Ue-f,Ct=i/e.purchasePrice*100,Gt=i*s.vacancyRate+c+k,Vt=(i-Gt)/e.purchasePrice*100,Ft=fe>0?Ne/(fe*12):0,jt=ge>0?De/(ge*12):0,Nt=ye>0?Ke/(ye*12):0;return{apartment:e,taxTableMode:r,annualGrossIncome:t,annualTax:C,marginalTaxRate:G,annualGrowthRate:a,startEquity:f,totalInvestment:m,ancillaryCosts:V,initialDebt:Ve,projectedValue20:Je,cumulativeCashflow20:O,wealth20:Ue,wealthGain20:Tt,constructionPhaseMonthlyLiquidity:Pt,afaPhaseOneMonthlyLiquidity:Ft,afaPhaseTwoMonthlyLiquidity:jt,postAfaMonthlyLiquidity:Nt,refinanceDebtBase:Fe,grossYield:Ct,netYieldBeforeDebt:Vt,yearlyWealthPath:We,yearlyLiquidityRows:Oe}}function Sa(e){const t=l("wealth-path"),a=Math.max(...e.map(n=>Math.abs(n)),1);t.style.setProperty("--year-count",String(e.length)),t.innerHTML=e.map((n,r)=>{const i=Math.max(Math.abs(n)/a*100,3),c=n>=0?"path-bar-positive":"path-bar-negative";return`
        <div class="path-col" title="Jahr ${r+1}: ${h(n)}">
          <span class="path-bar-wrap">
            <span class="path-bar ${c}" style="height: ${i.toFixed(2)}%"></span>
          </span>
          <span class="path-year">${r+1}</span>
        </div>
      `}).join("")}function Ma(e){const t=U(L);ca.textContent=t;const a=gt(L),n=ft(L);if(qe.title=`Vorherige Ansicht: ${U(a)}`,$e.title=`Naechste Ansicht: ${U(n)}`,qe.setAttribute("aria-label",`Vorherige Ansicht: ${U(a)}`),$e.setAttribute("aria-label",`Naechste Ansicht: ${U(n)}`),L==="table"){Ie.innerHTML=qa(e),ht(e);return}ee();const r=L==="afterTaxChart"?"afterTax":"beforeTax";Ie.innerHTML=xa(e,r)}function xa(e,t){const a=e.yearlyLiquidityRows.map(u=>({calendarYear:u.calendarYear,monthlyValue:t==="afterTax"?u.cashflow/12:(u.cashflow-u.taxBenefit)/12})),n=a.map(u=>u.monthlyValue),r=Math.max(...n.map(u=>Math.abs(u)),1),i=Math.max(...n,0),c=Math.min(...n,0);return`
    <button
      class="liquidity-chart-card"
      type="button"
      data-liquidity-cycle="true"
      aria-label="Liquiditaetsansicht weiterschalten"
    >
      <div class="liquidity-chart-meta">
        <div>
          <p class="liquidity-chart-title">${t==="afterTax"?"Nach Steuern":"Vor Steuern"}</p>
          <p class="liquidity-chart-copy">Klick auf das Diagramm fuer die naechste Ansicht</p>
        </div>
        <p class="liquidity-chart-range">${w(c)} bis ${w(i)} / Monat</p>
      </div>
      <div class="liquidity-chart" style="--year-count: ${n.length}">
        <div class="liquidity-scale">
          <span>${h(r)}</span>
          <span>0 €</span>
          <span>-${h(r).replace("-","")}</span>
        </div>
        <div class="liquidity-chart-plot">
          ${a.map(u=>{const C=u.monthlyValue===0?0:Math.max(Math.abs(u.monthlyValue)/r*46,2),G=u.monthlyValue>=0?"liquidity-bar-positive":"liquidity-bar-negative",V=String(u.calendarYear).slice(-2);return`
                <div class="liquidity-year" title="${u.calendarYear}: ${w(u.monthlyValue)} / Monat">
                  <div class="liquidity-year-plot">
                    <span class="liquidity-bar ${G}" style="--bar-size: ${C.toFixed(2)}%"></span>
                  </div>
                  <span class="liquidity-year-label">${V}</span>
                </div>
              `}).join("")}
        </div>
      </div>
    </button>
  `}function qa(e){const t=e.yearlyLiquidityRows[0]?.calendarYear??s.purchaseYear,a=e.yearlyLiquidityRows[e.yearlyLiquidityRows.length-1]?.calendarYear??s.purchaseYear+B-1;return`
    <button
      type="button"
      class="liquidity-table-preview"
      data-liquidity-open-table="true"
      aria-label="Vollbildansicht der Liquiditaetstabelle oeffnen"
    >
      <p class="liquidity-chart-title">Details im Vollbild ansehen</p>
      <p class="liquidity-chart-copy">
        ${t} bis ${a} mit allen Jahreswerten zu Miete, Zins, Tilgung, Steuer und Kumulierung.
      </p>
      <span class="liquidity-inline-toggle">Tabelle oeffnen</span>
    </button>
  `}function $a(e){let t=0;return`
    <div class="liquidity-table-card liquidity-table-card-modal">
      <div class="liquidity-table-scroll liquidity-table-scroll-modal">
        <table class="liquidity-detail-table" aria-label="Jaehrliche Einnahmen Ausgaben Details">
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Miete</th>
              <th>Zins</th>
              <th>Tilgung</th>
              <th>Nebenkosten</th>
              <th>Steuer</th>
              <th>Liqui v. St.</th>
              <th>Liqui n. St.</th>
              <th>Kumuliert</th>
            </tr>
          </thead>
          <tbody>${e.yearlyLiquidityRows.map(n=>{const r=n.kfwInterest+n.bankInterest+n.refinanceInterest,i=n.kfwPrincipal+n.bankPrincipal+n.refinancePrincipal,c=n.vacancyCost+n.managementCost+n.maintenanceCost,k=n.cashflow-n.taxBenefit,u=n.cashflow;return t+=u,`
        <tr>
          <td>${n.calendarYear}</td>
          <td class="${Y(n.grossRent)}">${w(n.grossRent)}</td>
          <td class="${Y(-r)}">${w(-r)}</td>
          <td class="${Y(-i)}">${w(-i)}</td>
          <td class="${Y(-c)}">${w(-c)}</td>
          <td class="${Y(n.taxBenefit)}">${w(n.taxBenefit)}</td>
          <td class="${Y(k)}">${w(k)}</td>
          <td class="${Y(u)}">${w(u)}</td>
          <td class="${Y(t)}">${w(t)}</td>
        </tr>
      `}).join("")}</tbody>
        </table>
      </div>
    </div>
  `}function ht(e){ba.innerHTML=$a(e),!_&&(H.classList.add("liquidity-modal-open"),H.setAttribute("aria-hidden","false"),document.body.classList.add("body-modal-open"),_=!0)}function ee(){_&&(H.classList.remove("liquidity-modal-open"),H.setAttribute("aria-hidden","true"),document.body.classList.remove("body-modal-open"),_=!1)}function Ye(){L=ft(L)}function Ia(){L=gt(L)}function ft(e){return e==="afterTaxChart"?"beforeTaxChart":e==="beforeTaxChart"?"table":"afterTaxChart"}function gt(e){return e==="afterTaxChart"?"table":e==="beforeTaxChart"?"afterTaxChart":"beforeTaxChart"}function U(e){return e==="afterTaxChart"?"Nach Steuern":e==="beforeTaxChart"?"Vor Steuern":"Details"}function Ra(){const e=new URLSearchParams;v!==g.defaultApartmentId&&e.set("apartment",v),z!=="grund"&&e.set("tax",z),R!==g.defaultAnnualGrossIncome&&e.set("gross",String(Math.round(R))),A!==s.annualGrowthRate*100&&e.set("growth",String(A)),x!==Te(v)&&e.set("equity",String(Math.round(x)));const t=e.toString(),a=t?`${window.location.pathname}?${t}`:window.location.pathname;window.history.replaceState(null,"",a)}function Aa(){const e=new URLSearchParams(window.location.search),t=e.get("apartment");t&&X(t)&&Le.some(c=>c.id===t)&&(v=t);const a=e.get("tax");a&&$t(a)&&(z=a),x=Te(v);const n=e.get("gross")??e.get("income");n&&(R=I(N(n,R),g.incomeBounds.min,g.incomeBounds.max));const r=e.get("growth");r&&(A=I(N(r,A),T.min,T.max));const i=e.get("equity");i&&(x=I(N(i,x),M.min,M.max))}function yt(e,t,a,n,r){const i=new URLSearchParams;return i.set("apartment",e),i.set("tax",t),i.set("gross",String(Math.round(a))),i.set("growth",String(n)),i.set("equity",String(Math.round(r))),`${window.location.origin}${window.location.pathname}?${i.toString()}`}function b(e,t){l(e).textContent=t}function Ea(e){Se.value=String(Math.round(e))}function Ba(e){Me.value=String(e)}function La(e){xe.value=String(Math.round(e))}function Ya(e){la.textContent=e}function za(e,t){const a="Beratung zum Immobilieninvestment York Living",n=["Guten Tag Herr Peters,","","ich bitte um eine zeitnahe Kontaktaufnahme fuer eine Beratung zum Immobilieninvestment York Living.","","Aktueller Berechnungsstand aus dem Dashboard:",`- Wohnung: ${e.apartment.label}`,`- Steuertarif: ${St(e.taxTableMode)}`,`- Bruttojahreseinkommen: ${h(e.annualGrossIncome)}`,`- Wertentwicklung p.a.: ${It(e.annualGrowthRate*100)} %`,`- Eigenkapital: ${h(e.startEquity)}`,`- Vermoegen nach ${B} Jahren: ${h(e.wealth20)}`,"",`Szenario-Link: ${t}`,"","Vielen Dank."];ha.href=`mailto:andreas.peters@mlp.de?subject=${encodeURIComponent(a)}&body=${encodeURIComponent(n.join(`
`))}`}function bt(){mt.forEach(e=>{e.checked=e.value===z})}function wt(){const e=j[Re];st.src=Ge(e.image),st.alt=e.alt,fa.textContent=e.caption}function ze(e){const t=j.length;t!==0&&(Re=(Re+e+t)%t,wt())}function ce(){Q!==null||j.length<2||(Q=window.setInterval(()=>{ze(1)},6e3))}function Pe(){Q!==null&&(window.clearInterval(Q),Q=null)}function kt(){Pe(),ce()}function vt(e){const t=Le.find(a=>a.id===e);if(!t)throw new Error(`Apartment "${e}" not found.`);return t}function Pa(e){const t=Ce(e);if(t<s.afaStartYear)return 0;const a=t-s.afaStartYear+1,n=s.afaSchedule.find(i=>a>=i.startYear&&a<=i.endYear);if(!n)return 0;const r=t===s.afaStartYear?(5-s.afaStartQuarter)/4:1;return n.rate*r}function Ta(){const t=[...s.afaSchedule].sort((a,n)=>a.startYear-n.startYear)[0];return t?t.endYear:8}function Ca(){return s.afaSchedule.reduce((e,t)=>Math.max(e,t.endYear),0)}function ot(e){const t=Math.max(e,0);if(t<=11604)return 0;if(t<=17005){const a=(t-11604)/1e4;return(922.98*a+1400)*a}if(t<=66760){const a=(t-17005)/1e4;return(181.19*a+2397)*a+1025.38}return t<=277825?.42*t-10602.13:.45*t-18936.88}function Ee(e,t){const a=Math.max(e,0);return t==="splitting"?2*ot(a/2):ot(a)}function Ga(e,t){const a=Math.max(e,0),n=1,r=Ee(a,t),i=Ee(a+n,t);return Math.max((i-r)/n,0)}function St(e){return e==="splitting"?"Splittingtabelle":"Grundtabelle"}function Te(e){const a=vt(e).purchasePrice*s.ancillaryCostRate;return I(a,M.min,M.max)}function Ce(e){return s.purchaseYear+e-1}function lt(e){return s.afaStartYear-s.purchaseYear+e}function Va(e){const t=Ce(e);return t<s.rentStartYear?0:t>s.rentStartYear?1:(5-s.rentStartQuarter)/4}function Fa(){return[{title:"Finanzierung",copy:"KfW, Bankdarlehen und Tilgungslogik.",open:!0,fields:[{type:"number",id:"config-kfw-loan-amount",label:"KfW-Darlehen",hint:"Foerderdarlehen fuer das Objekt.",mode:"currency",min:0,step:500,get:e=>e.assumptions.kfwLoanAmount,set:(e,t)=>{e.assumptions.kfwLoanAmount=t}},{type:"number",id:"config-kfw-interest-rate",label:"KfW-Zins",hint:"Nominalzins fuer den KfW-Anteil.",mode:"percent",min:0,max:15,step:.05,get:e=>e.assumptions.kfwInterestRate,set:(e,t)=>{e.assumptions.kfwInterestRate=t}},{type:"number",id:"config-kfw-repayment-rate",label:"KfW-Tilgung",hint:"Regulaere Tilgung nach der Karenz.",mode:"percent",min:0,max:15,step:.05,get:e=>e.assumptions.kfwRepaymentRate,set:(e,t)=>{e.assumptions.kfwRepaymentRate=t}},{type:"number",id:"config-kfw-grace-years",label:"Karenzjahre",hint:"Jahre mit nur Zinszahlung im KfW-Teil.",mode:"number",min:0,max:10,step:1,get:e=>e.assumptions.kfwGraceYears,set:(e,t)=>{e.assumptions.kfwGraceYears=t}},{type:"number",id:"config-kfw-grant-amount",label:"KfW-Zuschuss",hint:"Tilgungszuschuss aus dem Programm.",mode:"currency",min:0,step:500,get:e=>e.assumptions.kfwGrantAmount,set:(e,t)=>{e.assumptions.kfwGrantAmount=t}},{type:"number",id:"config-bank-interest-rate",label:"Bankzins",hint:"Nominalzins fuer den Bankanteil.",mode:"percent",min:0,max:15,step:.05,get:e=>e.assumptions.bankInterestRate,set:(e,t)=>{e.assumptions.bankInterestRate=t}},{type:"number",id:"config-bank-repayment-rate",label:"Banktilgung",hint:"Jaehrliche Tilgung fuer das Bankdarlehen.",mode:"percent",min:0,max:15,step:.05,get:e=>e.assumptions.bankRepaymentRate,set:(e,t)=>{e.assumptions.bankRepaymentRate=t}}]},{title:"Markt & Entwicklung",copy:"Mietniveau, Wachstum und laufende Kosten.",open:!0,fields:[{type:"number",id:"config-rent-per-sqm",label:"Miete pro m2",hint:"Monatliche Nettokaltmiete je Quadratmeter.",mode:"currency",min:0,max:100,step:.05,get:e=>e.assumptions.rentPerSqm,set:(e,t)=>{e.assumptions.rentPerSqm=t}},{type:"number",id:"config-annual-growth-rate",label:"Wertentwicklung",hint:"Gemeinsame Entwicklung von Miete und Objektwert pro Jahr.",mode:"percent",min:-10,max:15,step:.1,get:e=>e.assumptions.annualGrowthRate,set:(e,t)=>{e.assumptions.annualGrowthRate=t}},{type:"number",id:"config-purchase-year",label:"Kaufjahr",hint:"Startjahr der Rechnung und des Investments.",mode:"number",min:2020,max:2040,step:1,get:e=>e.assumptions.purchaseYear,set:(e,t)=>{e.assumptions.purchaseYear=t}},{type:"number",id:"config-rent-start-year",label:"Mietstart Jahr",hint:"Erstes Kalenderjahr mit Vermietung.",mode:"number",min:2020,max:2045,step:1,get:e=>e.assumptions.rentStartYear,set:(e,t)=>{e.assumptions.rentStartYear=t}},{type:"number",id:"config-rent-start-quarter",label:"Mietstart Quartal",hint:"Quartal des Vermietungsstarts innerhalb des Startjahres.",mode:"number",min:1,max:4,step:1,get:e=>e.assumptions.rentStartQuarter,set:(e,t)=>{e.assumptions.rentStartQuarter=t}},{type:"number",id:"config-monument-share",label:"Denkmalanteil",hint:"Abschreibungsfaehiger Anteil am Kaufpreis.",mode:"percent",min:0,max:100,step:1,get:e=>e.assumptions.monumentShare,set:(e,t)=>{e.assumptions.monumentShare=t}},{type:"number",id:"config-ancillary-cost-rate",label:"Nebenkostenquote",hint:"Zusatzkosten auf den Kaufpreis.",mode:"percent",min:0,max:25,step:.1,get:e=>e.assumptions.ancillaryCostRate,set:(e,t)=>{e.assumptions.ancillaryCostRate=t}},{type:"number",id:"config-vacancy-rate",label:"Leerstandsquote",hint:"Sicherheitsabschlag fuer entgangene Miete.",mode:"percent",min:0,max:20,step:.1,get:e=>e.assumptions.vacancyRate,set:(e,t)=>{e.assumptions.vacancyRate=t}},{type:"number",id:"config-monthly-management-flat",label:"Verwaltung pauschal",hint:"Projektweiter Monatswert in EUR.",mode:"currency",min:0,step:5,get:e=>e.assumptions.monthlyManagementFlat,set:(e,t)=>{e.assumptions.monthlyManagementFlat=t}},{type:"number",id:"config-monthly-maintenance-flat",label:"Ruecklage pauschal",hint:"Projektweiter Monatswert in EUR.",mode:"currency",min:0,step:5,get:e=>e.assumptions.monthlyMaintenanceFlat,set:(e,t)=>{e.assumptions.monthlyMaintenanceFlat=t}}]},{title:"Wohnung A",copy:"1-Zimmer-Apartment aus der Broschuere.",open:!1,fields:[{type:"number",id:"config-apartment-a-size",label:"Groesse",hint:"Wohnflaeche in m2.",mode:"number",min:10,max:120,step:1,get:e=>d(e,"a").size,set:(e,t)=>{d(e,"a").size=t}},{type:"number",id:"config-apartment-a-purchase-price",label:"Kaufpreis",hint:"Investitionssumme vor Nebenkosten.",mode:"currency",min:0,step:1e3,get:e=>d(e,"a").purchasePrice,set:(e,t)=>{d(e,"a").purchasePrice=t}},{type:"number",id:"config-apartment-a-management",label:"Verwaltung",hint:"Wohnungsspezifische Kosten pro Monat.",mode:"currency",min:0,step:5,get:e=>d(e,"a").monthlyManagement,set:(e,t)=>{d(e,"a").monthlyManagement=t}},{type:"number",id:"config-apartment-a-maintenance",label:"Ruecklage",hint:"Wohnungsspezifische Instandhaltung pro Monat.",mode:"currency",min:0,step:5,get:e=>d(e,"a").monthlyMaintenance,set:(e,t)=>{d(e,"a").monthlyMaintenance=t}},{type:"number",id:"config-apartment-a-other-cost",label:"Weitere Kosten",hint:"Sonstige Monatskosten fuer Wohnung A.",mode:"currency",min:0,step:5,get:e=>d(e,"a").monthlyOtherCost,set:(e,t)=>{d(e,"a").monthlyOtherCost=t}}]},{title:"Wohnung B",copy:"2-Zimmer-Apartment aus der Broschuere.",open:!1,fields:[{type:"number",id:"config-apartment-b-size",label:"Groesse",hint:"Wohnflaeche in m2.",mode:"number",min:10,max:120,step:1,get:e=>d(e,"b").size,set:(e,t)=>{d(e,"b").size=t}},{type:"number",id:"config-apartment-b-purchase-price",label:"Kaufpreis",hint:"Investitionssumme vor Nebenkosten.",mode:"currency",min:0,step:1e3,get:e=>d(e,"b").purchasePrice,set:(e,t)=>{d(e,"b").purchasePrice=t}},{type:"number",id:"config-apartment-b-management",label:"Verwaltung",hint:"Wohnungsspezifische Kosten pro Monat.",mode:"currency",min:0,step:5,get:e=>d(e,"b").monthlyManagement,set:(e,t)=>{d(e,"b").monthlyManagement=t}},{type:"number",id:"config-apartment-b-maintenance",label:"Ruecklage",hint:"Wohnungsspezifische Instandhaltung pro Monat.",mode:"currency",min:0,step:5,get:e=>d(e,"b").monthlyMaintenance,set:(e,t)=>{d(e,"b").monthlyMaintenance=t}},{type:"number",id:"config-apartment-b-other-cost",label:"Weitere Kosten",hint:"Sonstige Monatskosten fuer Wohnung B.",mode:"currency",min:0,step:5,get:e=>d(e,"b").monthlyOtherCost,set:(e,t)=>{d(e,"b").monthlyOtherCost=t}}]},{title:"AfA & Steuer",copy:"Abschreibung und Grenzsteuersaetze fuer die Liquiditaet.",open:!1,fields:[{type:"number",id:"config-projection-years",label:"Projektionsjahre",hint:"Laufzeit der Vermoegensprojektion.",mode:"number",min:1,max:40,step:1,get:e=>e.assumptions.years,set:(e,t)=>{e.assumptions.years=t}},{type:"number",id:"config-afa-start-year",label:"AfA Start Jahr",hint:"Jahr des Abschlusses der beguenstigten Baumaßnahme.",mode:"number",min:2020,max:2045,step:1,get:e=>e.assumptions.afaStartYear,set:(e,t)=>{e.assumptions.afaStartYear=t}},{type:"number",id:"config-afa-start-quarter",label:"AfA Start Quartal",hint:"Quartal, ab dem die Denkmal-AfA erstmals anlaeuft.",mode:"number",min:1,max:4,step:1,get:e=>e.assumptions.afaStartQuarter,set:(e,t)=>{e.assumptions.afaStartQuarter=t}},{type:"number",id:"config-afa-rate-1",label:"AfA Satz Phase 1",hint:"Abschreibung in den ersten Jahren.",mode:"percent",min:0,max:20,step:.1,get:e=>S(e,0).rate,set:(e,t)=>{const a=S(e,0);e.assumptions.afaSchedule[0]={...a,rate:t}}},{type:"number",id:"config-afa-end-year-1",label:"AfA Ende Phase 1",hint:"Letztes Jahr der ersten Abschreibungsphase.",mode:"number",min:1,max:30,step:1,get:e=>S(e,0).endYear,set:(e,t)=>{const a=S(e,0);e.assumptions.afaSchedule[0]={...a,endYear:t}}},{type:"number",id:"config-afa-rate-2",label:"AfA Satz Phase 2",hint:"Abschreibung in der zweiten Phase.",mode:"percent",min:0,max:20,step:.1,get:e=>S(e,1).rate,set:(e,t)=>{const a=S(e,1);e.assumptions.afaSchedule[1]={...a,rate:t}}},{type:"number",id:"config-afa-end-year-2",label:"AfA Ende Phase 2",hint:"Letztes Jahr der zweiten Abschreibungsphase.",mode:"number",min:1,max:40,step:1,get:e=>S(e,1).endYear,set:(e,t)=>{const a=S(e,1);e.assumptions.afaSchedule[1]={...a,endYear:t}}},{type:"number",id:"config-tax-limit-1",label:"Steuergrenze 1",hint:"Monatliches Brutto fuer Satz 1.",mode:"currency",min:0,step:50,get:e=>p(e,0).maxMonthlyIncome,set:(e,t)=>{e.taxBrackets[0]={...p(e,0),maxMonthlyIncome:t}}},{type:"number",id:"config-tax-rate-1",label:"Steuersatz 1",hint:"Grenzsteuersatz fuer die erste Stufe.",mode:"percent",min:0,max:60,step:.1,get:e=>p(e,0).rate,set:(e,t)=>{e.taxBrackets[0]={...p(e,0),rate:t}}},{type:"number",id:"config-tax-limit-2",label:"Steuergrenze 2",hint:"Monatliches Brutto fuer Satz 2.",mode:"currency",min:0,step:50,get:e=>p(e,1).maxMonthlyIncome,set:(e,t)=>{e.taxBrackets[1]={...p(e,1),maxMonthlyIncome:t}}},{type:"number",id:"config-tax-rate-2",label:"Steuersatz 2",hint:"Grenzsteuersatz fuer die zweite Stufe.",mode:"percent",min:0,max:60,step:.1,get:e=>p(e,1).rate,set:(e,t)=>{e.taxBrackets[1]={...p(e,1),rate:t}}},{type:"number",id:"config-tax-limit-3",label:"Steuergrenze 3",hint:"Monatliches Brutto fuer Satz 3.",mode:"currency",min:0,step:50,get:e=>p(e,2).maxMonthlyIncome,set:(e,t)=>{e.taxBrackets[2]={...p(e,2),maxMonthlyIncome:t}}},{type:"number",id:"config-tax-rate-3",label:"Steuersatz 3",hint:"Grenzsteuersatz fuer die dritte Stufe.",mode:"percent",min:0,max:60,step:.1,get:e=>p(e,2).rate,set:(e,t)=>{e.taxBrackets[2]={...p(e,2),rate:t}}},{type:"number",id:"config-tax-limit-4",label:"Steuergrenze 4",hint:"Monatliches Brutto fuer Satz 4.",mode:"currency",min:0,step:50,get:e=>p(e,3).maxMonthlyIncome,set:(e,t)=>{e.taxBrackets[3]={...p(e,3),maxMonthlyIncome:t}}},{type:"number",id:"config-tax-rate-4",label:"Steuersatz 4",hint:"Grenzsteuersatz fuer die vierte Stufe.",mode:"percent",min:0,max:60,step:.1,get:e=>p(e,3).rate,set:(e,t)=>{e.taxBrackets[3]={...p(e,3),rate:t}}},{type:"number",id:"config-tax-limit-5",label:"Steuergrenze 5",hint:"Monatliches Brutto fuer Satz 5.",mode:"currency",min:0,step:50,get:e=>p(e,4).maxMonthlyIncome,set:(e,t)=>{e.taxBrackets[4]={...p(e,4),maxMonthlyIncome:t}}},{type:"number",id:"config-tax-rate-5",label:"Steuersatz 5",hint:"Grenzsteuersatz fuer die letzte Stufe.",mode:"percent",min:0,max:60,step:.1,get:e=>p(e,4).rate,set:(e,t)=>{e.taxBrackets[4]={...p(e,4),rate:t}}}]},{title:"Standards & Grenzen",copy:"Vorgaben fuer den Rechner und die UI-Schieberegler.",open:!1,fields:[{type:"select",id:"config-default-apartment",label:"Startwohnung",hint:"Welche Wohnung zuerst ausgewaehlt sein soll.",options:e=>e.apartments.map(t=>({value:t.id,label:t.label})),get:e=>e.defaultApartmentId,set:(e,t)=>{if(!X(t))throw new Error("Startwohnung ist ungueltig.");e.defaultApartmentId=t}},{type:"number",id:"config-default-income",label:"Standard-Einkommen",hint:"Ausgangswert beim ersten Laden der Seite.",mode:"currency",min:0,step:1e3,get:e=>e.defaultAnnualGrossIncome,set:(e,t)=>{e.defaultAnnualGrossIncome=t}},{type:"number",id:"config-income-min",label:"Einkommen Minimum",hint:"Untergrenze fuer das Eingabefeld.",mode:"currency",min:0,step:100,get:e=>e.incomeBounds.min,set:(e,t)=>{e.incomeBounds.min=t}},{type:"number",id:"config-income-max",label:"Einkommen Maximum",hint:"Obergrenze fuer das Eingabefeld.",mode:"currency",min:1e3,step:100,get:e=>e.incomeBounds.max,set:(e,t)=>{e.incomeBounds.max=t}},{type:"number",id:"config-income-step",label:"Einkommen Schritt",hint:"Schrittweite im Eingabefeld.",mode:"currency",min:1,step:1,get:e=>e.incomeBounds.step,set:(e,t)=>{e.incomeBounds.step=t}},{type:"number",id:"config-income-months-factor",label:"EK-Monatsfaktor",hint:"Ableitung des Standard-Eigenkapitals aus dem Einkommen.",mode:"number",min:0,max:24,step:.5,get:e=>e.equityModel.incomeMonthsFactor,set:(e,t)=>{e.equityModel.incomeMonthsFactor=t}},{type:"number",id:"config-min-equity",label:"Mindest-Eigenkapital",hint:"Untergrenze fuer das Eigenkapital im Rechner.",mode:"currency",min:0,step:500,get:e=>e.equityModel.minEquity,set:(e,t)=>{e.equityModel.minEquity=t}},{type:"number",id:"config-max-investment-ratio",label:"Max. Investitionsquote",hint:"Deckel fuer das eingesetzte Eigenkapital relativ zum Investment.",mode:"percent",min:0,max:100,step:1,get:e=>e.equityModel.maxTotalInvestmentRatio,set:(e,t)=>{e.equityModel.maxTotalInvestmentRatio=t}}]}]}function ja(e,t){return e.map(a=>`
        <details class="config-group"${a.open?" open":""}>
          <summary class="config-group-toggle">
            <span>${a.title}</span>
            <small>${a.copy}</small>
          </summary>
          <div class="config-grid">
            ${a.fields.map(r=>Na(r,t)).join("")}
          </div>
        </details>
      `).join("")}function Na(e,t){if(e.type==="select")return`
      <label class="config-field" for="${e.id}">
        <span class="config-field-label">${e.label}</span>
        <span class="config-field-hint">${e.hint}</span>
        <span class="config-input-wrap">
          <select id="${e.id}" class="config-select">
            ${e.options(t).map(r=>{const i=r.value===e.get(t)?" selected":"";return`<option value="${r.value}"${i}>${r.label}</option>`}).join("")}
          </select>
        </span>
      </label>
    `;const a=e.min!==void 0?` min="${e.min}"`:"",n=e.max!==void 0?` max="${e.max}"`:"";return`
    <label class="config-field" for="${e.id}">
      <span class="config-field-label">${e.label}</span>
      <span class="config-field-hint">${e.hint}</span>
      <span class="config-input-wrap">
        <input
          id="${e.id}"
          class="config-input"
          type="number"
          step="${e.step}"
          inputmode="decimal"
          value="${Ua(e.get(t),e.mode)}"${a}${n}
        />
        <span class="config-input-unit">${Qa(e.mode)}</span>
      </span>
    </label>
  `}function Mt(e){const t=se(g);for(const a of ut)for(const n of a.fields){if(n.type==="select"){const c=Rt(e,n.id);n.set(t,c.value);continue}const r=Za(e,n.id),i=n.mode==="percent"?r/100:r;n.set(t,i)}return Da(t),qt(t)}function Da(e){const t=d(e,"a"),a=d(e,"b");t.subtitle=ct("a",t.size),a.subtitle=ct("b",a.size);const n=Math.max(e.incomeBounds.min,e.incomeBounds.max);e.incomeBounds.max=n,e.incomeBounds.min=Math.min(e.incomeBounds.min,n),e.incomeBounds.step=Math.max(1,e.incomeBounds.step),e.assumptions.purchaseYear=Math.round(e.assumptions.purchaseYear),e.assumptions.rentStartYear=Math.max(e.assumptions.purchaseYear,Math.round(e.assumptions.rentStartYear)),e.assumptions.rentStartQuarter=I(Math.round(e.assumptions.rentStartQuarter),1,4),e.assumptions.afaStartYear=Math.max(e.assumptions.purchaseYear,Math.round(e.assumptions.afaStartYear)),e.assumptions.afaStartQuarter=I(Math.round(e.assumptions.afaStartQuarter),1,4);const r=S(e,0),i=S(e,1);e.assumptions.afaSchedule[0]={...r,startYear:1,endYear:Math.max(1,Math.round(r.endYear))},e.assumptions.afaSchedule[1]={...i,startYear:e.assumptions.afaSchedule[0].endYear+1,endYear:Math.max(e.assumptions.afaSchedule[0].endYear+1,Math.round(i.endYear))},e.taxBrackets=e.taxBrackets.map(c=>({maxMonthlyIncome:Math.max(0,c.maxMonthlyIncome),rate:Math.max(0,c.rate)})).sort((c,k)=>c.maxMonthlyIncome-k.maxMonthlyIncome)}function xt(e){return JSON.stringify(e,null,2)}function Ka(e){try{const t=window.localStorage.getItem(Z);return t?qt(JSON.parse(t)):se(e)}catch{return window.localStorage.removeItem(Z),se(e)}}function Wa(e){window.localStorage.setItem(Z,xt(e))}function Oa(){window.localStorage.removeItem(Z)}function Ja(){return window.localStorage.getItem(Z)!==null}function qt(e){if(!P(e))throw new Error("Root muss ein JSON-Objekt sein.");const t=String(e.defaultApartmentId),a=e.defaultAnnualGrossIncome,n=e.incomeBounds,r=e.equityModel,i=e.assumptions,c=e.apartments,k=e.taxBrackets;if(!X(t))throw new Error('defaultApartmentId muss "a" oder "b" sein.');const u=t;if(typeof a!="number")throw new Error("defaultAnnualGrossIncome muss eine Zahl sein.");if(!P(n))throw new Error("incomeBounds fehlt oder ist ungueltig.");if(!P(r))throw new Error("equityModel fehlt oder ist ungueltig.");if(!P(i))throw new Error("assumptions fehlt oder ist ungueltig.");if(!Array.isArray(c)||c.length===0)throw new Error("apartments muss ein nicht-leeres Array sein.");if(!Array.isArray(k))throw new Error("taxBrackets muss ein Array sein.");const C=c.map(m=>{if(!P(m))throw new Error("Jedes apartment muss ein Objekt sein.");const f=String(m.id);if(!X(f))throw new Error('Jedes apartment braucht eine gueltige id ("a" oder "b").');return{id:f,label:ve(m.label,"apartment.label"),subtitle:ve(m.subtitle,"apartment.subtitle"),size:o(m.size,"apartment.size"),purchasePrice:o(m.purchasePrice,"apartment.purchasePrice"),image:ve(m.image,"apartment.image"),monthlyManagement:o(m.monthlyManagement,"apartment.monthlyManagement"),monthlyMaintenance:o(m.monthlyMaintenance,"apartment.monthlyMaintenance"),monthlyOtherCost:o(m.monthlyOtherCost,"apartment.monthlyOtherCost")}});if(!C.some(m=>m.id===u))throw new Error("defaultApartmentId muss in apartments enthalten sein.");const G={rentPerSqm:o(i.rentPerSqm,"assumptions.rentPerSqm"),ancillaryCostRate:o(i.ancillaryCostRate,"assumptions.ancillaryCostRate"),vacancyRate:o(i.vacancyRate,"assumptions.vacancyRate"),monthlyManagementFlat:o(i.monthlyManagementFlat,"assumptions.monthlyManagementFlat"),monthlyMaintenanceFlat:o(i.monthlyMaintenanceFlat,"assumptions.monthlyMaintenanceFlat"),purchaseYear:o(i.purchaseYear,"assumptions.purchaseYear"),rentStartYear:o(i.rentStartYear,"assumptions.rentStartYear"),rentStartQuarter:o(i.rentStartQuarter,"assumptions.rentStartQuarter"),afaStartYear:o(i.afaStartYear,"assumptions.afaStartYear"),afaStartQuarter:o(i.afaStartQuarter,"assumptions.afaStartQuarter"),kfwLoanAmount:o(i.kfwLoanAmount,"assumptions.kfwLoanAmount"),kfwInterestRate:o(i.kfwInterestRate,"assumptions.kfwInterestRate"),kfwRepaymentRate:o(i.kfwRepaymentRate,"assumptions.kfwRepaymentRate"),kfwGraceYears:o(i.kfwGraceYears,"assumptions.kfwGraceYears"),kfwGrantAmount:o(i.kfwGrantAmount,"assumptions.kfwGrantAmount"),bankInterestRate:o(i.bankInterestRate,"assumptions.bankInterestRate"),bankRepaymentRate:o(i.bankRepaymentRate,"assumptions.bankRepaymentRate"),monumentShare:o(i.monumentShare,"assumptions.monumentShare"),annualGrowthRate:o(i.annualGrowthRate,"assumptions.annualGrowthRate"),years:o(i.years,"assumptions.years"),afaSchedule:Array.isArray(i.afaSchedule)?i.afaSchedule.map((m,f)=>{if(!P(m))throw new Error(`assumptions.afaSchedule[${f}] ist ungueltig.`);return{startYear:o(m.startYear,`assumptions.afaSchedule[${f}].startYear`),endYear:o(m.endYear,`assumptions.afaSchedule[${f}].endYear`),rate:o(m.rate,`assumptions.afaSchedule[${f}].rate`)}}):(()=>{throw new Error("assumptions.afaSchedule muss ein Array sein.")})()},V=k.map((m,f)=>{if(!P(m))throw new Error(`taxBrackets[${f}] ist ungueltig.`);return{maxMonthlyIncome:o(m.maxMonthlyIncome,`taxBrackets[${f}].maxMonthlyIncome`),rate:o(m.rate,`taxBrackets[${f}].rate`)}});return{defaultApartmentId:u,defaultAnnualGrossIncome:a,incomeBounds:{min:o(n.min,"incomeBounds.min"),max:o(n.max,"incomeBounds.max"),step:o(n.step,"incomeBounds.step")},equityModel:{incomeMonthsFactor:o(r.incomeMonthsFactor,"equityModel.incomeMonthsFactor"),minEquity:o(r.minEquity,"equityModel.minEquity"),maxTotalInvestmentRatio:o(r.maxTotalInvestmentRatio,"equityModel.maxTotalInvestmentRatio")},assumptions:G,taxBrackets:V,apartments:C}}function se(e){return JSON.parse(JSON.stringify(e))}function N(e,t){const a=Number.parseFloat(e.replace(",","."));return Number.isFinite(a)?a:t}function I(e,t,a){return Math.min(Math.max(e,t),a)}function X(e){return e==="a"||e==="b"}function $t(e){return e==="grund"||e==="splitting"}function h(e){return sa.format(e)}function w(e){return e>0?`+${h(e)}`:h(e)}function It(e){return e>0?`+${oe(e)}`:oe(e)}function oe(e){return oa.format(e)}function Y(e){return e>0?"tone-positive":e<0?"tone-negative":""}function Ua(e,t){const a=t==="percent"?e*100:e;return String(Number(a.toFixed(4)))}function Qa(e){return e==="percent"?"%":e==="currency"?"EUR":""}function Za(e,t){const a=Rt(e,t);return Ha(a.value,t)}function Ha(e,t){const a=e.replace(",",".").trim();if(!a.length)throw new Error(`"${t}" darf nicht leer sein.`);const n=Number.parseFloat(a);if(!Number.isFinite(n))throw new Error(`"${t}" ist keine gueltige Zahl.`);return n}function Rt(e,t){const a=e.querySelector(`#${t}`);if(!a)throw new Error(`Feld "${t}" wurde nicht gefunden.`);return a}function d(e,t){const a=e.apartments.find(n=>n.id===t);if(!a)throw new Error(`Konfigurationsdaten fuer Wohnung "${t}" fehlen.`);return a}function S(e,t){return e.assumptions.afaSchedule[t]??Be.assumptions.afaSchedule[t]??{startYear:t===0?1:S(e,t-1).endYear+1,endYear:t===0?8:12,rate:0}}function p(e,t){return e.taxBrackets[t]??Be.taxBrackets[t]??{maxMonthlyIncome:999999,rate:0}}function ct(e,t){return`${e==="a"?"1-Zimmer":"2-Zimmer"}, ca. ${Math.round(t)} m2`}function D(e,t=!1){rt.textContent=e,rt.classList.toggle("config-status-error",t)}function o(e,t){if(typeof e!="number"||Number.isNaN(e))throw new Error(`${t} muss eine Zahl sein.`);return e}function ve(e,t){if(typeof e!="string"||e.length===0)throw new Error(`${t} muss ein String sein.`);return e}function P(e){return typeof e=="object"&&e!==null}async function At(e){if(!navigator.clipboard?.writeText)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function l(e){const t=document.getElementById(e);if(!t)throw new Error(`Missing element "${e}".`);return t}function Ge(e){if(/^https?:\/\//.test(e))return e;const t="/YorkLiving/",a=t.endsWith("/")?t:`${t}/`,n=e.startsWith("/")?e.slice(1):e;return`${a}${n}`}
