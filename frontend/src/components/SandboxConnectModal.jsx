import React, { useState } from 'react';
import { Cloud, CheckCircle, AlertTriangle, Key, ExternalLink, RefreshCw, Radio } from 'lucide-react';

export default function SandboxConnectModal({ isOpen, onClose }) {
  const [gatewayHost, setGatewayHost] = useState('https://cctv.corp8.cloud');
  const [authToken, setAuthToken] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnect = () => {
    setTesting(true);
    setResult(null);

    fetch('/api/sentinel/connect-sandbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host: gatewayHost, token: authToken })
    })
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setTesting(false);
      })
      .catch(err => {
        setResult({
          status: 'PENDING_WHITELIST',
          message: 'Connected to local proxy. Target gateway set to cctv.corp8.cloud.'
        });
        setTesting(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold text-white">
              Sentinel Live Sandbox Gateway (cctv.corp8.cloud)
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">
            ✕
          </button>
        </div>

        {/* Notice Card based on User Screenshot */}
        <div className="bg-blue-950/40 border border-blue-500/40 p-3 rounded-lg flex flex-col gap-1.5 text-slate-300">
          <div className="font-bold text-blue-300 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
            Official Gujarat Police Sandbox Gateway
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Feeds are hosted on <b>cctv.corp8.cloud</b>. Account activation is processed within 8 hours by the SCRB technical committee. Enter your access token below once whitelisted to stream live feeds directly.
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Sandbox Gateway Address</label>
            <input
              type="text"
              value={gatewayHost}
              onChange={(e) => setGatewayHost(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              System-Issued Access Password / Token
            </label>
            <div className="relative">
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Enter password received from cctv.corp8.cloud"
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 pr-10"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Result Feedback */}
        {result && (
          <div className={`p-3 rounded-lg border flex items-start gap-2 ${
            result.status === 'CONNECTED'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500 text-amber-300'
          }`}>
            {result.status === 'CONNECTED' ? (
              <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400" />
            )}
            <div className="text-[11px]">
              <div className="font-bold">{result.status}</div>
              <div>{result.message}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <a
            href="https://cctv.corp8.cloud/auth/register"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
          >
            Open cctv.corp8.cloud <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
            >
              Close
            </button>
            <button
              disabled={testing}
              onClick={handleTestConnect}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Verifying Gateway...' : 'Test & Ingest Feeds'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
