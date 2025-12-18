#!/bin/bash

echo "=================================================="
echo "     A2 Coffee Haui - Automatic Installer"
echo "=================================================="

# --- 1. Check for Node.js ---
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js first."
    exit 1
fi

# --- 2. Backend Setup ---
echo ""
echo "[1/4] Setting up Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed."
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file from defaults..."
    cat <<EOT > .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=a2_snack
PORT=3000
JWT_SECRET=secret_key_change_me
EOT
    echo "[WARN] Created default .env file. Please check database credentials if connection fails."
fi

# --- Import Database ---
echo ""
echo "[INFO] Checking Database..."
DB_NAME="a2_snack"
DB_USER="root"
DB_PASS=""
# Look for SQL file in the db folder relative to the project root
SQL_FILE="../db/a2_coffee_haui.sql"

if [ -f "$SQL_FILE" ]; then
    echo "Found SQL dump file: $SQL_FILE"
    read -p "Would you like to import/reset the database? (y/n) [n]: " IMPORT_CHOICE
    IMPORT_CHOICE=${IMPORT_CHOICE:-n}

    if [[ "$IMPORT_CHOICE" == "y" || "$IMPORT_CHOICE" == "Y" ]]; then
        echo ""
        echo "Please enter MySQL config (Press Enter for defaults):"
        read -p "User [root]: " DB_USER_INPUT
        DB_USER=${DB_USER_INPUT:-$DB_USER}
        
        read -s -p "Password [empty]: " DB_PASS_INPUT
        echo ""
        DB_PASS=$DB_PASS_INPUT

        echo "Creating database if not exists..."
        if [ -z "$DB_PASS" ]; then
            mysql -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            echo "Importing data..."
            mysql -u "$DB_USER" "$DB_NAME" < "$SQL_FILE"
        else
            mysql -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            echo "Importing data..."
            mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$SQL_FILE"
        fi

        if [ $? -ne 0 ]; then
            echo "[ERROR] Database import failed. Continuing anyway..."
        else
            echo "[SUCCESS] Database imported successfully."
        fi
    fi
else
    echo "[INFO] No SQL dump file found at $SQL_FILE. Skipping import."
fi

cd ..

# --- 3. Frontend Setup ---
echo ""
echo "[2/4] Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed."
fi

echo ""
echo "[3/4] Building Frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "[ERROR] Frontend build failed."
    exit 1
fi
cd ..

# --- 4. Start Server ---
echo ""
echo "[4/4] Starting Application..."
echo ""
echo "Application is running at: http://localhost:3000"
echo "(Press Ctrl+C to stop)"
echo "=================================================="

cd backend
npm start
