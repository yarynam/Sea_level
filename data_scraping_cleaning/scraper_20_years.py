import mechanize
import datetime
import urllib2
from bs4 import BeautifulSoup



br = mechanize.Browser()
br.open('http://uhslc.soest.hawaii.edu/data/rq.html?_=1462080827388')



# Get HTML
html = br.response().read()

# Transform the HTML into a BeautifulSoup object
soup = BeautifulSoup(html, "html.parser")


table = soup.find('table', {'id':'table'})
rows = table.find_all('tr')[2:]


for row in rows:
    cells = row.find_all("td")
    name = cells[3].get_text().replace(" ", "_")
    latitude = cells[5].get_text()
    longtitude = cells[6].get_text()
    country = cells[4].get_text()
    date_start = datetime.datetime.strptime(cells[7].get_text(), "%Y-%m-%d")
    date_end = datetime.datetime.strptime(cells[8].get_text(), "%Y-%m-%d")
    date_min = datetime.datetime.strptime("1995-01-01", "%Y-%m-%d")
    date_max = datetime.datetime.strptime("2013-12-31", "%Y-%m-%d")

    if date_start < date_min and date_end > date_max:
        url = cells[10].find( 'a' ).get("href")
        rq = urllib2.Request(url)
        res = urllib2.urlopen(rq)
        csv = open("all_20years_new/" + latitude + "%" + longtitude + "%" + name + ".csv", 'wb')
        csv.write(res.read())
        csv.close()
        print name, latitude, longtitude
