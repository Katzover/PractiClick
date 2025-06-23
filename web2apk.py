import tkinter as tk
from tkinter import filedialog, messagebox
import subprocess
import sys
import os

def browse_icon():
    icon_path = filedialog.askopenfilename(filetypes=[("Image Files", "*.png;*.jpg;*.jpeg")])
    if icon_path:
        icon_entry.delete(0, tk.END)
        icon_entry.insert(0, icon_path)

def generate_apk():
    package_name = package_entry.get()
    label = label_entry.get()
    icon = icon_entry.get()
    url = url_entry.get()
    if not package_name or not label or not icon or not url:
        messagebox.showerror("Error", "All fields are required!")
        return

    # Path to the website-to-apk main.py
    repo_dir = r"c:\Users\Administraitor\Documents\Code\website-to-apk"
    main_py = os.path.join(repo_dir, "main.py")
    if not os.path.isfile(main_py):
        messagebox.showerror("Error", f"main.py not found in {repo_dir}")
        return

    # Output directory for APK
    output_dir = os.path.join(os.getcwd(), "output_apk")
    os.makedirs(output_dir, exist_ok=True)

    # Build the command
    cmd = [
        sys.executable, main_py,
        "--package", package_name,
        "--label", label,
        "--icon", icon,
        "--url", url,
        "--output", output_dir
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        messagebox.showinfo("Success", f"APK generated successfully!\nOutput: {output_dir}")
    except subprocess.CalledProcessError as e:
        messagebox.showerror("Error", f"Failed to generate APK:\n{e.stderr}")

# Create the main window
root = tk.Tk()
root.title("Website to APK Generator")

# Package Name
tk.Label(root, text="Package Name:").grid(row=0, column=0, padx=10, pady=5, sticky="w")
package_entry = tk.Entry(root, width=40)
package_entry.grid(row=0, column=1, padx=10, pady=5)

# Label
tk.Label(root, text="App Label:").grid(row=1, column=0, padx=10, pady=5, sticky="w")
label_entry = tk.Entry(root, width=40)
label_entry.grid(row=1, column=1, padx=10, pady=5)

# Icon
tk.Label(root, text="App Icon:").grid(row=2, column=0, padx=10, pady=5, sticky="w")
icon_entry = tk.Entry(root, width=40)
icon_entry.grid(row=2, column=1, padx=10, pady=5)
tk.Button(root, text="Browse", command=browse_icon).grid(row=2, column=2, padx=10, pady=5)

# URL
tk.Label(root, text="Website URL:").grid(row=3, column=0, padx=10, pady=5, sticky="w")
url_entry = tk.Entry(root, width=40)
url_entry.grid(row=3, column=1, padx=10, pady=5)

# Generate APK Button
tk.Button(root, text="Generate APK", command=generate_apk).grid(row=4, column=0, columnspan=3, pady=20)

# Run the application
root.mainloop()