/**
 * One-off seeder for the legal.* settings (public legal pages).
 * Fills only keys whose body is missing/empty so later admin edits are never
 * clobbered; pass --force to overwrite existing bodies too.
 *
 *   node scripts/seed-legal.js          # fill empty/missing only
 *   node scripts/seed-legal.js --force  # overwrite everything
 *
 * The percentages in the refund schedule are business defaults consistent with
 * the Paket Tur Sözleşmeleri Yönetmeliği structure — review/adjust them from
 * the admin panel (Yasal Sayfalar) if the agency's actual terms differ.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const FORCE = process.argv.includes('--force');

const S = {
  brand: 'Endülüs Travel',
  legalName: 'ROTA ATLAS TURİZM SEYAHAT ACENTASI',
  tursab: '6739',
  address: 'Osmanağa Mah. Çilek Sok. Akel İşhanı No:1 Kat:2 İç Kapı No:42, Kadıköy / İstanbul',
  phone: '+90 507 938 45 08',
  email: 'info@endulustravel.com',
  site: 'www.endulustravel.com',
  updated: '13 Ağustos 2026',
};

const sellerTable = `
<table>
  <tbody>
    <tr><th>Ticari Unvan</th><td>${S.legalName}</td></tr>
    <tr><th>Marka</th><td>${S.brand}</td></tr>
    <tr><th>TÜRSAB Belge No</th><td>${S.tursab}</td></tr>
    <tr><th>Adres</th><td>${S.address}</td></tr>
    <tr><th>Telefon</th><td><a href="tel:+905079384508">${S.phone}</a></td></tr>
    <tr><th>E-posta</th><td><a href="mailto:${S.email}">${S.email}</a></td></tr>
    <tr><th>İnternet Sitesi</th><td>https://${S.site}</td></tr>
  </tbody>
</table>`;

const updatedLine = `<p><em>Son güncelleme: ${S.updated}</em></p>`;

const DOCS = {
  'legal.privacy': {
    title: 'Gizlilik ve Çerez Politikası',
    body: `
${updatedLine}
<p>${S.brand} markası ile faaliyet gösteren <strong>${S.legalName}</strong> (TÜRSAB Belge No: ${S.tursab}) olarak, ${S.site} adresini ziyaret eden ve hizmetlerimizden yararlanan kişilerin gizliliğine önem veriyoruz. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve nasıl koruduğumuzu açıklar. Kişisel verilerin işlenmesine ilişkin ayrıntılı bilgi için <a href="/kvkk">KVKK Aydınlatma Metni</a>'ni de inceleyebilirsiniz.</p>

<h2>Topladığımız Bilgiler</h2>
<ul>
  <li><strong>Form bilgileri:</strong> Rezervasyon/bilgi talebi ve iletişim formlarında paylaştığınız ad soyad, e-posta, telefon, tercih ettiğiniz tur ve tarih, kişi sayısı ile eklediğiniz mesaj ve özel istekler.</li>
  <li><strong>Otomatik toplanan bilgiler:</strong> IP adresi, tarayıcı ve cihaz bilgisi, ziyaret edilen sayfalar gibi teknik kayıtlar (sunucu logları) ve aşağıda açıklanan çerezler.</li>
  <li><strong>İletişim kayıtları:</strong> Telefon, e-posta veya WhatsApp üzerinden bizimle kurduğunuz yazışmalar.</li>
</ul>
<p>Web sitemiz üzerinden <strong>kredi kartı bilgisi toplanmaz</strong>. Ödemeler, banka havalesi/EFT ile veya anlaşmalı banka/ödeme kuruluşlarının güvenli (3D Secure) ödeme sayfalarına yönlendiren ödeme bağlantıları üzerinden gerçekleşir; kart bilgileriniz yalnızca ilgili banka/ödeme kuruluşu tarafından işlenir.</p>

<h2>Bilgilerinizi Nasıl Kullanıyoruz?</h2>
<ul>
  <li>Tur rezervasyon ve bilgi taleplerinizi yanıtlamak, size özel teklif hazırlamak,</li>
  <li>Rezervasyon, ödeme, sözleşme ve tur operasyon süreçlerini yürütmek,</li>
  <li>Yasal yükümlülüklerimizi (ör. fatura düzenleme, seyahat acentalığı mevzuatı) yerine getirmek,</li>
  <li>Hizmet kalitemizi ölçmek ve reklam kampanyalarımızın performansını değerlendirmek.</li>
</ul>

<h2>Bilgi Paylaşımı</h2>
<p>Kişisel verilerinizi ticari amaçla üçüncü kişilere satmayız. Veriler yalnızca aşağıdaki durumlarda paylaşılır:</p>
<ul>
  <li><strong>Hizmetin ifası için iş ortakları:</strong> Turun gerçekleştirilmesi amacıyla oteller, havayolları, transfer ve yerel hizmet sağlayıcıları ile (yalnızca gerekli olduğu ölçüde) yolcu bilgileri paylaşılır.</li>
  <li><strong>Bankalar ve ödeme kuruluşları:</strong> Ödeme işlemlerinin gerçekleştirilmesi sürecinde.</li>
  <li><strong>Reklam ölçümü (Meta):</strong> Sitemizde Meta (Facebook/Instagram) Pixel ve Conversions API kullanılmaktadır. Reklam performansının ölçülmesi amacıyla form gönderimi gibi etkileşimler, e-posta/telefon bilgileri kriptografik olarak özetlenerek (hash) Meta Platforms ile paylaşılabilir. Bu, verilerinizin yurt dışına aktarımı anlamına gelebilir; ayrıntı için <a href="/kvkk">KVKK Aydınlatma Metni</a>'ne bakınız.</li>
  <li><strong>Yasal merciler:</strong> Mevzuattan doğan yükümlülükler kapsamında yetkili kurum ve kuruluşlarla.</li>
</ul>

<h2>Çerezler (Cookies)</h2>
<ul>
  <li><strong>Zorunlu/işlevsel:</strong> Dil tercihiniz (tarayıcı deposunda) ve oturum güvenliği için gerekli kayıtlar.</li>
  <li><strong>Reklam/analitik:</strong> Meta Pixel çerezleri, reklam kampanyalarının ölçümü için kullanılır.</li>
  <li><strong>Üçüncü taraf içerikler:</strong> Sayfalarımıza gömülü Instagram içerikleri ve Google Haritalar, ilgili sağlayıcıların kendi çerezlerini kullanabilir.</li>
</ul>
<p>Çerezleri tarayıcınızın ayarlarından dilediğiniz zaman silebilir veya engelleyebilirsiniz; bu durumda sitenin bazı işlevleri kısıtlanabilir.</p>

<h2>Veri Güvenliği ve Saklama</h2>
<p>Sitemiz SSL sertifikası ile şifreli olarak sunulur; verileriniz erişimi sınırlandırılmış sistemlerde saklanır. Kişisel veriler, işlenme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen zamanaşımı süreleri boyunca saklanır, sonrasında silinir veya anonim hale getirilir.</p>

<h2>Haklarınız ve İletişim</h2>
<p>Verilerinize erişme, düzeltme, silme ve işlenmesine itiraz etme dâhil haklarınız için <a href="/kvkk">KVKK Aydınlatma Metni</a>'ndeki başvuru yollarını kullanabilir veya <a href="mailto:${S.email}">${S.email}</a> adresine yazabilirsiniz.</p>
${sellerTable}
`,
  },

  'legal.terms': {
    title: 'Kullanım Koşulları',
    body: `
${updatedLine}
<p>Bu internet sitesi (${S.site}), <strong>${S.legalName}</strong> (marka: ${S.brand}) tarafından işletilmektedir. Siteyi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>

<h2>Şirket ve Belge Bilgileri</h2>
${sellerTable}
<p>${S.brand}, 1618 sayılı Seyahat Acentaları ve Seyahat Acentaları Birliği Kanunu kapsamında faaliyet gösteren, TÜRSAB üyesi bir seyahat acentasıdır.</p>

<h2>Hizmetin Tanımı</h2>
<p>Sitemizde yurt içi ve yurt dışı paket tur programları, tarihleri ve fiyatları yayınlanır; rezervasyon ve bilgi talepleri çevrim içi formlar, telefon, e-posta ve WhatsApp üzerinden alınır. Satış süreci; talebinizin ekibimizce teyidi, tur ve fiyat bilgisinin netleştirilmesi ve ödemenin banka havalesi/EFT veya güvenli ödeme bağlantısı ile tamamlanması şeklinde ilerler. Satışlarda <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</a> ile <a href="/iptal-ve-iade-kosullari">İptal ve İade Koşulları</a> uygulanır.</p>

<h2>Fiyatlar ve Program Değişiklikleri</h2>
<ul>
  <li>Yurt dışı paket turlarda fiyatlar döviz cinsinden ilan edilebilir; ödeme koşulları rezervasyon sırasında bildirilir.</li>
  <li>Sitede yer alan fiyat, tarih ve program bilgileri kontenjan ve tedarikçi koşullarına bağlı olarak değişebilir; bağlayıcı olan, rezervasyon teyidinde ve sözleşmede yer alan bilgilerdir.</li>
  <li>Dizgi/yazım hatasından kaynaklanan bariz hatalı fiyatlar acentayı bağlamaz.</li>
</ul>

<h2>Fikri Mülkiyet</h2>
<p>Sitedeki metin, görsel, video, logo ve tasarımların hakları ${S.brand}'a veya lisans verenlerine aittir; yazılı izin olmaksızın kopyalanamaz ve ticari amaçla kullanılamaz.</p>

<h2>Sorumluluk</h2>
<p>Site içeriğinin güncel ve doğru olması için özen gösterilir; ancak teknik aksaklıklar veya güncelleme gecikmelerinden doğabilecek dolaylı zararlardan acenta sorumlu tutulamaz. Sitede bağlantı verilen üçüncü taraf sitelerin (Instagram, WhatsApp, harita servisleri vb.) içeriklerinden ilgili sağlayıcılar sorumludur.</p>

<h2>Kişisel Veriler</h2>
<p>Kişisel verilerin işlenmesine ilişkin esaslar <a href="/gizlilik">Gizlilik ve Çerez Politikası</a> ile <a href="/kvkk">KVKK Aydınlatma Metni</a>'nde açıklanmıştır.</p>

<h2>Uygulanacak Hukuk</h2>
<p>Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Tüketici işlemlerinden doğan uyuşmazlıklarda, mevzuattaki parasal sınırlar dâhilinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</p>
`,
  },

  'legal.kvkk': {
    title: 'KVKK Aydınlatma Metni',
    body: `
${updatedLine}
<p>Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, veri sorumlusu sıfatıyla <strong>${S.legalName}</strong> (marka: ${S.brand}, "Acenta") tarafından hazırlanmıştır.</p>
${sellerTable}

<h2>İşlenen Kişisel Veriler</h2>
<ul>
  <li><strong>Kimlik ve iletişim:</strong> Ad soyad, telefon, e-posta; tur kaydı hâlinde pasaport/kimlik bilgileri (vize ve biletleme işlemleri için gerekli olduğu ölçüde).</li>
  <li><strong>Müşteri işlem:</strong> Talep edilen tur, tarih, kişi sayısı, rezervasyon ve ödeme kayıtları (kart bilgileri hariç — kart işlemleri banka/ödeme kuruluşunda gerçekleşir).</li>
  <li><strong>İşlem güvenliği ve pazarlama:</strong> IP adresi, çerez kayıtları, reklam etkileşim verileri.</li>
</ul>

<h2>İşleme Amaçları ve Hukuki Sebepler</h2>
<ul>
  <li>Rezervasyon/bilgi taleplerinin yanıtlanması, sözleşmenin kurulması ve ifası (KVKK md. 5/2-c: sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması),</li>
  <li>Fatura düzenleme, seyahat acentalığı mevzuatına uyum, yetkili mercilere bilgi verme (md. 5/2-ç: hukuki yükümlülüğün yerine getirilmesi),</li>
  <li>Hizmet kalitesinin geliştirilmesi ve kayıtların güvenliği (md. 5/2-f: meşru menfaat),</li>
  <li>Reklam ölçümü ve çevrim içi pazarlama (Meta Pixel/Conversions API) — <strong>açık rızanıza</strong> dayanır; formlarımızı kullanmadan da sitemizden yararlanabilirsiniz.</li>
</ul>

<h2>Aktarım</h2>
<ul>
  <li>Turun ifası için oteller, havayolları, transfer firmaları, vize/konsolosluk süreçleri ve yurt dışındaki yerel hizmet sağlayıcıları (hizmetin gerektirdiği ölçüde yurt dışına aktarım dâhil),</li>
  <li>Ödeme süreçlerinde bankalar ve ödeme kuruluşları,</li>
  <li>Reklam ölçümü amacıyla Meta Platforms (e-posta/telefon hash'lenerek; yurt dışına aktarım),</li>
  <li>Yasal yükümlülük kapsamında yetkili kamu kurum ve kuruluşları.</li>
</ul>

<h2>Toplama Yöntemi</h2>
<p>Verileriniz; internet sitemizdeki formlar, e-posta, telefon, WhatsApp yazışmaları ve çerezler aracılığıyla, kısmen otomatik ve otomatik olmayan yollarla toplanır.</p>

<h2>Saklama Süresi</h2>
<p>Kişisel veriler, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen saklama/zamanaşımı süreleri boyunca saklanır; sürelerin sonunda silinir, yok edilir veya anonim hâle getirilir.</p>

<h2>KVKK Madde 11 Kapsamındaki Haklarınız</h2>
<ul>
  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve buna ilişkin bilgi talep etme,</li>
  <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
  <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
  <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
  <li>Mevzuata uygun olarak silinmesini veya yok edilmesini isteme,</li>
  <li>Düzeltme/silme işlemlerinin aktarım yapılan üçüncü kişilere bildirilmesini isteme,</li>
  <li>Münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
  <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
</ul>

<h2>Başvuru</h2>
<p>Taleplerinizi, kimliğinizi tevsik edici belgelerle birlikte <a href="mailto:${S.email}">${S.email}</a> adresine e-posta ile veya yukarıdaki posta adresimize yazılı olarak iletebilirsiniz. Başvurular, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'e uygun olarak en geç 30 gün içinde ücretsiz sonuçlandırılır.</p>
`,
  },

  'legal.distanceSales': {
    title: 'Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme',
    body: `
${updatedLine}
<p>İşbu metin; 6502 sayılı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği ve Paket Tur Sözleşmeleri Yönetmeliği uyarınca, ${S.brand} üzerinden uzaktan iletişim araçlarıyla (internet sitesi, e-posta, telefon, WhatsApp, güvenli ödeme bağlantısı) gerçekleştirilen tur satışlarında <strong>ön bilgilendirme ve mesafeli satış sözleşmesi</strong> olarak uygulanır.</p>

<h2>1. Taraflar</h2>
<h3>Satıcı (Acenta)</h3>
${sellerTable}
<h3>Alıcı (Katılımcı)</h3>
<p>Rezervasyon formunda / ödeme bağlantısı talebinde ad soyad ve iletişim bilgileri yer alan gerçek kişi. Alıcının bilgileri, rezervasyon kaydında ve ödeme belgelerinde belirtilir.</p>

<h2>2. Sözleşmenin Konusu</h2>
<p>Sözleşmenin konusu, Alıcının elektronik ortamda talep ettiği paket tur hizmetinin (tur adı, hareket ve dönüş tarihleri, kapsam — ulaşım, konaklama, rehberlik ve programda "dahil" olarak sayılan hizmetler — kişi sayısı ve toplam bedel) satışı ve ifası ile ilgili tarafların hak ve yükümlülükleridir. <strong>Tura ilişkin bu bilgiler; ilgili tur sayfasında, rezervasyon teyit mesajında ve/veya ödeme bağlantısı açıklamasında Alıcıya ayrıca bildirilir</strong> ve işbu sözleşmenin ayrılmaz parçasıdır.</p>

<h2>3. Fiyat ve Ödeme</h2>
<ul>
  <li>Tur bedeli; tur sayfasında ve rezervasyon teyidinde belirtilen tutardır. Yurt dışı paket turlarda bedel döviz cinsinden belirlenebilir.</li>
  <li>Ödeme; banka havalesi/EFT ile veya Acentanın ilettiği <strong>güvenli ödeme bağlantısı</strong> (banka/ödeme kuruluşunun 3D Secure ödeme sayfası) üzerinden yapılır. Kart bilgileri Acenta tarafından görülmez ve saklanmaz.</li>
  <li>Rezervasyon, tur sayfasında belirtilen kapora tutarının ödenmesi ile kesinleşir; bakiyenin ödeme planı rezervasyon teyidinde bildirilir.</li>
  <li>Zorunlu vergi ve harçlar ile programda "dahil değildir" denilen kalemler tur bedeline dâhil değildir.</li>
</ul>

<h2>4. Hizmetin İfası</h2>
<ul>
  <li>Hizmet, rezervasyon teyidinde belirtilen tarihlerde ve programda açıklanan kapsamda ifa edilir.</li>
  <li>Acenta; kontenjan, hava koşulları, güvenlik ve tedarikçi kaynaklı zorunlu hâllerde, hizmetin özünü değiştirmemek kaydıyla programda makul değişiklik yapabilir; önemli değişiklikler Alıcıya bildirilir.</li>
  <li>Alıcı; pasaport geçerliliği, vize, sağlık ve aşı gerekliliklerine ilişkin kendi yükümlülüklerini yerine getirmekle sorumludur. Acenta bu konularda bilgilendirme desteği sağlar.</li>
</ul>

<h2>5. Cayma Hakkı (Önemli)</h2>
<p>Mesafeli Sözleşmeler Yönetmeliği'nin cayma hakkının istisnalarına ilişkin hükümleri uyarınca; <strong>belirli bir tarihte veya dönemde yapılması gereken konaklama, yolcu taşıma ve boş zamanın değerlendirilmesine ilişkin hizmetlerde (paket turlar dâhil) 14 günlük cayma hakkı uygulanmaz.</strong> Bu nedenle tur satın alımlarında cayma hakkı yerine, aşağıda ve <a href="/iptal-ve-iade-kosullari">İptal ve İade Koşulları</a> sayfasında yer alan iptal/iade hükümleri geçerlidir.</p>

<h2>6. İptal, Devir ve İade</h2>
<p>Alıcının ve Acentanın iptal hakları, iade oran ve süreleri ile mücbir sebep hâlleri <a href="/iptal-ve-iade-kosullari">İptal ve İade Koşulları</a>'nda düzenlenmiştir; söz konusu koşullar işbu sözleşmenin ayrılmaz parçasıdır. Alıcı, turun başlamasından makul süre önce yazılı bildirimde bulunarak paket turu, katılım koşullarını taşıyan üçüncü bir kişiye devredebilir; devirden doğan ek masraflar devreden ve devralan tarafından müteselsilen karşılanır.</p>

<h2>7. Kişisel Verilerin Korunması</h2>
<p>Alıcının kişisel verileri <a href="/kvkk">KVKK Aydınlatma Metni</a> ve <a href="/gizlilik">Gizlilik Politikası</a>'na uygun olarak işlenir.</p>

<h2>8. Uyuşmazlıkların Çözümü</h2>
<p>İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen parasal sınırlar çerçevesinde Alıcının veya Acentanın yerleşim yerindeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.</p>

<h2>9. Yürürlük</h2>
<p>Alıcı; rezervasyonu onaylayıp ödemeyi (kapora dâhil) gerçekleştirmekle, işbu sözleşmeyi ve ön bilgilendirmeyi okuduğunu, anladığını ve kabul ettiğini beyan etmiş sayılır. Sözleşme, ödemenin gerçekleştiği tarihte yürürlüğe girer.</p>
`,
  },

  'legal.refund': {
    title: 'İptal ve İade Koşulları',
    body: `
${updatedLine}
<p>Bu sayfa, ${S.brand} (${S.legalName} — TÜRSAB No: ${S.tursab}) tarafından satışı yapılan paket turlarda geçerli iptal, değişiklik ve iade koşullarını açıklar. Bu koşullar, <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</a>'nin ayrılmaz parçasıdır ve 6502 sayılı Kanun ile Paket Tur Sözleşmeleri Yönetmeliği'ne uygun olarak uygulanır.</p>

<h2>Katılımcının İptal Talebi</h2>
<p>İptal talepleri yazılı olarak (e-posta veya WhatsApp) iletilmelidir. Tur başlangıç tarihine kalan süreye göre aşağıdaki iade çizelgesi uygulanır:</p>
<table>
  <thead>
    <tr><th>Tur başlangıcına kalan süre</th><th>İade</th></tr>
  </thead>
  <tbody>
    <tr><td>30 gün ve daha fazla</td><td>Ödenmesi zorunlu vergi, harç ve benzeri yasal yükümlülüklerden doğan masraflar hariç, ödemenin tamamı iade edilir.</td></tr>
    <tr><td>29 – 15 gün</td><td>Tur bedelinin %65'i iade edilir (%35 kesinti uygulanır).</td></tr>
    <tr><td>14 – 7 gün</td><td>Tur bedelinin %50'si iade edilir.</td></tr>
    <tr><td>Son 7 gün içinde veya tura katılmama (no-show)</td><td>İade yapılmaz.</td></tr>
  </tbody>
</table>
<ul>
  <li>Kapora ödemeleri de aynı çizelgeye tabidir.</li>
  <li>Adına kesinleşmiş uçak bileti, vize ücreti ve benzeri, üçüncü kişilere ödenen ve iadesi mümkün olmayan bedeller, iade tutarından düşülebilir.</li>
  <li>Katılımcı, turun başlamasından makul süre önce yazılı bildirimle rezervasyonunu, katılım koşullarını taşıyan başka bir kişiye devredebilir.</li>
</ul>

<h2>Mücbir Sebep — Tam İade Güvencesi</h2>
<p>Doğal afet, salgın, savaş hâli, yaygın güvenlik sorunu gibi <strong>mücbir sebeplerle iptal edilen turlarda ödemenizin tamamı iade edilir.</strong> Katılımcının turun başlamasına engel, belgelenebilir mücbir sebebi (ağır hastalık, birinci derece yakın kaybı vb.) hâlinde de kesintisiz iade veya ücretsiz tarih değişikliği için azami kolaylık sağlanır.</p>

<h2>Acenta Kaynaklı İptal ve Değişiklik</h2>
<ul>
  <li>Yeterli katılım sağlanamaması veya tedarikçi kaynaklı zorunlu nedenlerle turun iptali hâlinde, katılımcıya derhâl bildirim yapılır ve ödemenin tamamı iade edilir ya da katılımcının kabul etmesi hâlinde eşdeğer nitelikte başka bir tur önerilir.</li>
  <li>Turun esaslı unsurlarında (tarih, süre, konaklama standardı) önemli değişiklik yapılması hâlinde katılımcı, değişikliği kabul etmeyerek ödemenin tamamının iadesini talep edebilir.</li>
</ul>

<h2>İadenin Yapılması</h2>
<p>Onaylanan iadeler, ödemenin yapıldığı yönteme (kartla ödemede ilgili karta, havale/EFT'de bildirilen IBAN'a) <strong>en geç 14 gün içinde</strong> yapılır. Kart iadelerinin hesabınıza yansıma süresi bankanıza göre değişebilir.</p>

<h2>Cayma Hakkı Hakkında Bilgilendirme</h2>
<p>Mesafeli Sözleşmeler Yönetmeliği uyarınca, belirli bir tarihte yapılması gereken konaklama, yolcu taşıma ve boş zamanın değerlendirilmesine ilişkin hizmetlerde (paket turlar dâhil) 14 günlük cayma hakkı uygulanmaz; bunun yerine yukarıdaki iptal ve iade koşulları geçerlidir.</p>

<h2>İletişim</h2>
<p>İptal, değişiklik ve iade talepleriniz için: <a href="mailto:${S.email}">${S.email}</a> · <a href="tel:+905079384508">${S.phone}</a></p>
`,
  },
};

const run = async () => {
  for (const [key, value] of Object.entries(DOCS)) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    const hasBody = Boolean(existing?.value?.body?.trim?.());
    if (hasBody && !FORCE) {
      console.log(`[seed-legal] ${key}: already has content — skipped (use --force to overwrite)`);
      continue;
    }
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    console.log(`[seed-legal] ${key}: ${existing ? 'updated' : 'created'} (${value.body.length} chars)`);
  }
};

run()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
