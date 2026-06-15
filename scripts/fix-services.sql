BEGIN;

-- Group tours: standardize boutique size to 15-20 (was 10-15)
UPDATE "Service"
SET title = 'Grup Turları (15-20 Kişi)',
    description = 'Sınırlı katılımcıyla, 15-20 kişilik butik gruplar için özel hazırlanmış turlar.',
    "fullDescription" = '15-20 kişilik butik gruplarla düzenlediğimiz turlarımız, kalabalık tur otobüslerindeki seyahatlerden sıkılanlar için idealdir.

Grup turlarımızda benzer ilgi alanlarına ve yaşam tarzlarına sahip kişilerle bir araya gelirsiniz. Butik gruplar oluşturarak herkesin seyahatten en yüksek verimi almasını sağlıyoruz.

Profesyonel rehberlerimiz eşliğinde bölgenin en önemli noktalarını keşfederken yeni dostluklar kurabilir, sıcak bir ortamda seyahat deneyiminizi zenginleştirebilirsiniz.',
    features = ARRAY['15-20 kişilik butik gruplar','Benzer profillerden oluşan uyumlu gruplar','Sosyal etkileşim fırsatları','Ekonomik fiyat avantajı','Profesyonel rehberlik hizmeti']::text[]
WHERE "serviceId" = 'group-tours';

-- Private tours: remove the "solo travelers" line (brand is family & women oriented)
UPDATE "Service"
SET "fullDescription" = 'Kişiye özel turlarımız, tamamen sizin istekleriniz ve tercihleriniz doğrultusunda, bütçenize göre hazırlanır. Seyahat rotanızı, konaklama seçeneklerinizi ve aktivitelerinizi dilediğiniz gibi şekillendirebilirsiniz.

Özel rehberiniz yalnızca size hizmet verir ve programınız tamamen size özel olarak tasarlanır. Böylece kalabalık gruplardan uzak, kendi temponuzda ve ilgi alanlarınıza göre bir seyahat deneyimi yaşarsınız.

Kişiye özel turlarımız aileler ve özel gruplar için idealdir.'
WHERE "serviceId" = 'private-tours';

-- Student tours -> reframe to budget-friendly, every age (brand: no age limit)
UPDATE "Service"
SET title = 'Bütçe Dostu Rotalar',
    description = 'Uygun bütçeyle, her yaşa açık; ekonomik konaklama ve ulaşımla maksimum deneyim sunan rotalar.',
    "fullDescription" = 'Bütçe dostu rotalarımız, uygun fiyatlarla maksimum deneyim yaşamanız için hazırlanır ve her yaştan misafirimize açıktır.

Ekonomik ama konforlu konaklama, akıllı ulaşım çözümleri ve uygun fiyatlı lezzet önerileriyle bütçenizi zorlamadan unutulmaz bir seyahat yaşarsınız.

Görülmesi gereken müze ve aktiviteleri programa dahil ederek, ödediğinizin karşılığını en iyi şekilde almanızı sağlıyoruz.',
    features = ARRAY['Ekonomik ve konforlu konaklama','Uygun fiyatlı ulaşım çözümleri','Her yaşa açık katılım','Kültürel ve tarihi duraklar','Bütçe dostu aktivite önerileri']::text[]
WHERE "serviceId" = 'student-tours';

-- Extreme & Adventure: off-brand (adrenaline) for a calm family/faith concept -> deactivate
UPDATE "Service" SET active = false WHERE "serviceId" = 'adventure-tours';

COMMIT;

SELECT "serviceId", title, active FROM "Service" ORDER BY "order", "createdAt";
