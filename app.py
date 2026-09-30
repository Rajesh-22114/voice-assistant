"""
LEO AI Assistant - Core Launcher Script
Launches the FastAPI backend server and automatically opens the interactive Dashboard in your default browser.
"""

import sys
import os
import socket
import webbrowser
import threading
import time

def find_available_port(start_port=8000, max_port=8020):
    for p in range(start_port, max_port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', p)) != 0:
                return p
    return start_port

def wait_for_server_and_open_browser(url, port):
    """
    Poll 127.0.0.1:port until Uvicorn server is fully bound and accepting HTTP requests.
    Prevents ERR_CONNECTION_REFUSED browser startup errors.
    """
    start_time = time.time()
    opened = False
    
    # Poll for up to 15 seconds
    while time.time() - start_time < 15.0:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(0.5)
                if s.connect_ex(('127.0.0.1', port)) == 0:
                    time.sleep(0.3)
                    webbrowser.open(url)
                    opened = True
                    break
        except Exception:
            pass
        time.sleep(0.2)
        
    if not opened:
        try:
            webbrowser.open(url)
        except Exception:
            pass

def run_server():
    """Launch the LEO AI Assistant Web Dashboard and FastAPI Server."""
    port = find_available_port(8000, 8020)
    dash_url = f"http://127.0.0.1:{port}"
    
    is_minimized = "--minimized" in sys.argv
    
    print("\n" + "=" * 66, flush=True)
    print(" >>> LEO AI Assistant Server is LIVE & Running!", flush=True)
    print(f" >>> Dashboard URL: {dash_url}", flush=True)
    if is_minimized:
        print(" >>> Mode: Minimized System Startup Mode", flush=True)
    else:
        print(f" >>> Waiting for server socket before launching browser...", flush=True)
    print(" >>> Keep this terminal open while using the assistant.", flush=True)
    print("=" * 66 + "\n", flush=True)
    
    # Auto-open dashboard in browser ONLY after server socket is live and listening
    if not is_minimized:
        threading.Thread(target=wait_for_server_and_open_browser, args=(dash_url, port), daemon=True).start()

    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=port, log_level="info")

if __name__ == "__main__":
    run_server()