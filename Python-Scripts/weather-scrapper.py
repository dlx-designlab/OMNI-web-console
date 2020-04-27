# This Script is scrapping data from the JMA website:
# Sample URL: https://www.data.jma.go.jp/obd/stats/etrn/view/hourly_s1.php?prec_no=50&block_no=47654&year=2018&month=12&day=5
import requests
from bs4 import BeautifulSoup
from datetime import timedelta, date
import csv

# Your dates range here:
start_date = date(2019, 11, 29)
end_date = date(2019, 12, 2)
# Which column to grab from the table
col=4


def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)



# Prepare the CSV file
with open('data.csv', mode='w') as csv_file:
    # fieldnames = []
    # for single_date in daterange(start_date, end_date):
    #     fieldnames.append(single_date.strftime("%Y-%m-%d"))
    # writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    # writer.writeheader()
    writer = csv.writer(csv_file)   

    # Set headers for the URL request
    headers = requests.utils.default_headers()
    headers.update({ 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})

    for single_date in daterange(start_date, end_date):

        print(f'Scrapping: {single_date.strftime("%Y-%m-%d")}')

        url = f"https://www.data.jma.go.jp/obd/stats/etrn/view/hourly_s1.php?prec_no=50&block_no=47654&year={single_date.year}&month={single_date.month}&day={single_date.day}"
        req = requests.get(url, headers)
        soup = BeautifulSoup(req.content, 'html.parser')

        # print(soup.prettify())

        data = []
        table = soup.find("table", attrs={'class':'data2_s'})
        # table_body = table.find('tbody')

        # Read al rows from the Table
        rows = table.find_all('tr')
        for row in rows:
            cols = row.find_all('td')
            cols = [ele.text.strip() for ele in cols]
            data.append([ele for ele in cols if ele]) # Get rid of empty values
        
        row_data = [single_date.strftime("%Y-%m-%d")]
        # Print the X column in each row
        for row in data:
            try :
                row_data.append(row[col])
                # writer.writerow({single_date.strftime("%Y-%m-%d"): row[col]})
                # print(row[col])
            except:
                print("no value")
        
        print(row_data)
        writer.writerow(row_data)

csv_file.close()
print("done!")