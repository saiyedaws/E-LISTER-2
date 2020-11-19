echo installing E-LISTER-2

echo ubuntu  | sudo -S -k apt install git -y
echo Updating Chrome Extensions

cd --
cd Documents
mkdir ChromeExtensions
cd ChromeExtensions
rm -rf E-LISTER-2
git clone https://github.com/saiyedaws/E-LISTER-2

echo done Updating/Downloading E-LISTER-2