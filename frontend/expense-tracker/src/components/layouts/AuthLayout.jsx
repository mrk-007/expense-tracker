import React from 'react'
import CARD_2 from '../../assets/images/card2.png'


const AuthLayout = ({children}) => {
  const barHeights = [20, 35, 55, 75, 30, 60, 65];

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row">
      {/* Left - form (40%) */}
      <div className="w-full md:w-[40%] px-8 md:px-16 py-12 flex items-start">
        <div className="w-full flex flex-col h-full">
          <h2 className="text-lg font-bold text-black mb-6 text-left">Expense Tracker</h2>
          <div className="flex flex-col justify-center h-full">
            {children}
          </div>
        </div>
      </div>

      {/* Right - preview (60%) */}
      <div className="flex w-full md:w-[60%] relative items-center justify-center bg-gradient-to-br from-violet-200 via-violet-100 to-indigo-50 overflow-hidden px-6 py-10 md:px-8 md:py-12">
        {/* decorative image (only asset used) */}
        <img src={CARD_2} alt="decor" className="pointer-events-none absolute md:-right-24 md:top-8 right-0 top-0 opacity-60 max-w-[45%] md:max-w-[45%]" />

        <div className="w-full max-w-3xl relative">
          {/* Income card */}
          <div className="md:absolute md:right-6 md:top-6 bg-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-4 w-[320px] md:w-[320px] mx-auto md:mx-0 mb-6 md:mb-0">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7DD3FC] to-[#0284C7] flex items-center justify-center text-[#0EA5E9]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 8 4-16 3 8h4" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-slate-500">Track Your Income & Expenses</div>
              <div className="text-lg font-semibold">₹430,000</div>
            </div>
          </div>

          {/* Bar chart card */}
          <div className="mt-6 md:mt-20 bg-white rounded-2xl shadow-2xl p-6 w-full mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-base font-semibold">All Transactions</div>
                <div className="text-xs text-slate-400">2nd Jan to 21th Dec</div>
              </div>
              <button className="text-sm text-violet-600 bg-violet-50 px-3 py-1 rounded-md">View More</button>
            </div>

            <div className="flex items-end gap-4 py-6">
              {/* Y labels column */}
              <div className="text-xs text-slate-400 pr-3 flex flex-col justify-between h-40">
                <span>400</span>
                <span>230</span>
                <span>160</span>
                <span>120</span>
                <span>50</span>
                <span>0</span>
              </div>

              {/* Bars */}
              <div className="flex-1 flex items-end gap-4 h-40">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((m, i) => (
                  <div key={m} className="flex flex-col items-center gap-2">
                    <div className={`w-8 rounded-t-md flex flex-col-reverse justify-end overflow-hidden`} style={{height: `${barHeights[i]}%`}}>
                      <div className="h-full" style={{background: 'linear-gradient(180deg,#6b21a8 0%, #a78bfa 100%)'}}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">{m}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthLayout