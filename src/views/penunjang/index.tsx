import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const PenunjangScreen = (props: any) => {

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const InfoRowHalf = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRowHalf}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const RatingRow = ({ letter, label, rating, stars }: { letter: string, label: string, rating: string, stars: number }) => (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLetter}>{letter}).</Text>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingValueBox}>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(i => (
            <Icons key={i} name="star" size={14} color={i <= stars ? '#F59E0B' : '#E5E7EB'} />
          ))}
        </View>
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <Icons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SKPI</Text>
      </View>

      {/* ── Body Wrapper ── */}
      <View style={styles.bodyWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.docHeader}>
            <Text style={styles.docTitle}>SURAT KETERANGAN</Text>
            <Text style={styles.docTitle}>PENDAMPING IJAZAH</Text>
            <View style={styles.docNumberBox}>
              <Text style={styles.docNumberText}>Nomor: 0037/K.14/SKPI-UIKA/2023</Text>
            </View>
            <Text style={styles.docDescription}>
              Surat Keterangan Pendamping Ijazah (SKPI) ini mengacu pada Kerangka Kualifikasi Nasional Indonesia (KKNI). Tujuan dari diterbitkannya dokumen SKPI bagi setiap lulusan Universitas Ibn Khaldun Bogor adalah untuk menerangkan dan menyatakan kemampuan kerja, penguasaan pengetahuan, dan sikap/moral pemegangnya.
            </Text>
          </View>

          {/* Section 1 */}
          <SectionHeader title="INFORMASI TENTANG IDENTITAS DIRI PEMEGANG SKPI" />
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="Nama Lengkap / Full Name" value="MIRNA ARYANI SOFIA" />
              <InfoRowHalf label="Tahun Lulus / Year of Completion" value="2023" />
            </View>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="Tempat dan Tanggal Lahir / Date and Place of Birth" value="BOGOR, 31 Juli 1999" />
              <InfoRowHalf label="Nomor Ijazah / Diploma Number" value="132012023001003" />
            </View>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="Nomor Pokok Mahasiswa / Student Identification Number" value="201207010749" />
              <InfoRowHalf label="Gelar / Name of Qualification" value="Sarjana Kesehatan Masyarakat (SKM)" />
            </View>
          </View>

          {/* Section 2 */}
          <SectionHeader title="INFORMASI TENTANG IDENTITAS PENYELENGGARA PROGRAM" />
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="SK Pendirian Perguruan Tinggi" value="Nomor 31PPP1961" />
              <InfoRowHalf label="Nama Perguruan Tinggi" value="Universitas Ibn Khaldun Bogor" />
            </View>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="Program Studi / Major" value="Kesehatan Masyarakat" />
              <InfoRowHalf label="Sistem Penilaian / Grading System" value="Skala 1-4; A=4; AB=3,5; B=3; BC=2,5; C=2; CD=1,5; D=1; E=0" />
            </View>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="Kelas / Class" value="REGULER_B" />
              <InfoRowHalf label="Lama Studi Reguler / Reguler Length of Studi" value="8 Semester" />
            </View>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="Jenis dan Jenjang Pendidikan" value="Akademik & Sarjana (Strata 1)" />
              <InfoRowHalf label="Jenjang Kualifikasi Sesuai KKNI" value="Level 6" />
            </View>
            <View style={styles.rowWrapper}>
              <InfoRowHalf label="Persyaratan Penerimaan / Entry Requirement" value="Lulus pendidikan menengah atas/sederajat" />
              <InfoRowHalf label="Jenis dan Jenjang Pendidikan Lanjut" value="Program Magister" />
            </View>
          </View>

          {/* Section 3 */}
          <SectionHeader title="KUALIFIKASI DAN HASIL YANG DICAPAI" />
          <View style={styles.sectionBody}>
            <Text style={styles.subHeading}>A. Capaian Pembelajaran</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Menunjukkan sikap dan nilai religiusitas yang tinggi sebagai wujud pemahaman yang baik terhadap ajaran Islam dalam merefleksikan diri sebagai sarjana yang bertanggung jawab secara profesional dan sosial</Text>
              <Text style={styles.bulletItem}>• Mencapai kemampuan intelektualitas yang baik dengan penguasaan ilmu pengetahuan dan Teknologi serta kemampuan literasi bidang keahliannya</Text>
              <Text style={styles.bulletItem}>• Memiliki Keterampilan penyelesaian masalah, komunikatif, kolaboratif, kreatif dan inovatif serta mampu bekerja dalam tim sebagai seorang profesional yang adaptif dengan perkembangan dan tuntutan zaman</Text>
            </View>
            <Text style={[styles.subHeading, { marginTop: 12 }]}>B. Aktivitas Prestasi dan Penghargaan</Text>
          </View>

          <SectionHeader title="Daftar Skill Set Mahasiswa*" />
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>No</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Skill Set</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Competencies</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'center' }]}>Qualification</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellText, { flex: 0.5 }]}>1.</Text>
            <Text style={[styles.tableCellText, { flex: 2, fontWeight: 'bold' }]}>Pengetahuan</Text>
            <View style={{ flex: 4.5 }}>
              <RatingRow letter="a" label="DASAR EPIDEMIOLOGI" rating="Very Good" stars={4} />
              <RatingRow letter="b" label="DASAR ILMU KESEHATAN MASYARAKAT" rating="Excellent" stars={5} />
              <RatingRow letter="c" label="ISU KESEHATAN GLOBAL" rating="Excellent" stars={5} />
            </View>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCellText, { flex: 0.5 }]}>2.</Text>
            <Text style={[styles.tableCellText, { flex: 2, fontWeight: 'bold' }]}>Keterampilan Khusus</Text>
            <View style={{ flex: 4.5 }}>
              <RatingRow letter="a" label="LATIHAN KERJA PEMINATAN K3" rating="Excellent" stars={5} />
              <RatingRow letter="b" label="PKL/PBL KESEHATAN MASYARAKAT" rating="Excellent" stars={5} />
            </View>
          </View>

          {/* Section 4 */}
          <SectionHeader title="Pengesahan SKPI" />
          <View style={styles.signatureSection}>
            <Text style={styles.signatureText}>Bogor, 11 September 2023</Text>
            <Text style={styles.signatureText}>Rektor,</Text>
            <Text style={styles.signatureText}>Universitas Ibn Khaldun Bogor</Text>
            
            <View style={styles.signatureSpace}>
              {/* Placeholder for Signature Image */}
              <Text style={{color: '#ccc', fontStyle: 'italic'}}>(Tanda Tangan)</Text>
            </View>
            
            <Text style={[styles.signatureText, { fontWeight: 'bold', textDecorationLine: 'underline' }]}>Prof. Dr. H.E. Mujahidin, M.Si</Text>
            <Text style={styles.signatureText}>NIK. 410 100 562</Text>
          </View>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15613F' },

  // Header
  header: {
    backgroundColor: '#15613F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(4),
    gap: responsiveWidth(3),
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
  },

  // Body wrapper
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: responsiveWidth(4),
    paddingBottom: responsiveWidth(10),
  },

  docHeader: {
    marginBottom: 16,
  },
  docTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#00B050',
  },
  docNumberBox: {
    backgroundColor: '#00B050',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  docNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.4),
  },
  docDescription: {
    fontSize: responsiveFontSize(1.3),
    color: '#333',
    lineHeight: 18,
    textAlign: 'justify',
  },
  sectionHeader: {
    backgroundColor: '#00B050',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 16,
    marginBottom: 8,
    borderTopRightRadius: 12,
  },
  sectionHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.4),
  },
  sectionBody: {
    paddingHorizontal: 4,
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoRowHalf: {
    flex: 1,
    paddingRight: 8,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: responsiveFontSize(1.2),
    color: '#333',
  },
  subHeading: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
    color: '#000',
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 8,
  },
  bulletItem: {
    fontSize: responsiveFontSize(1.2),
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
    textAlign: 'justify',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#00B050',
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.2),
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableCellText: {
    fontSize: responsiveFontSize(1.2),
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ratingLetter: {
    fontSize: responsiveFontSize(1.2),
    color: '#333',
    width: 20,
  },
  ratingLabel: {
    flex: 1,
    fontSize: responsiveFontSize(1.2),
    color: '#333',
  },
  ratingValueBox: {
    alignItems: 'center',
    width: 80,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: responsiveFontSize(1.1),
    color: '#333',
    fontStyle: 'italic',
    marginTop: 2,
  },
  signatureSection: {
    alignItems: 'flex-end',
    marginTop: 16,
    paddingRight: 16,
  },
  signatureText: {
    fontSize: responsiveFontSize(1.2),
    color: '#000',
    textAlign: 'right',
  },
  signatureSpace: {
    height: 80,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PenunjangScreen;
