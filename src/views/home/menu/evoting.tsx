import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import DialogComponent from '../../../component/dialog/DialogComponent';

import {
  getVotingDosen,
  getVotingQuesting,
  postVote,
} from '../../../services/home/index';

const EvotingComp = (props: any) => {
  // 1. Ambil Daftar Pertanyaan
  const { data, isLoading }: { data: any; isLoading: boolean } = useQuery({
    queryKey: ['listQuestion', {}],
    queryFn: () => getVotingQuesting(),
    onSuccess: (result) => console.log({ result }),
    onError: (result) => console.log({ result }),
  });

  const [detailDosen, setDetailDosen] = useState<any>();
  const [stateVote, setStateVote] = useState<'question' | 'vote'>('question');
  const [voteData, setVoteData] = useState<any>();

  // 2. Ambil Detail Opsi Jawaban (Dosen)
  const { mutate, isLoading: isLoadingData } = useMutation({
    mutationFn: getVotingDosen,
    onSuccess: (succ: any) => {
      setStateVote('vote');
      setDetailDosen(succ.data);
    },
  });

  // 3. Post Vote (Submit)
  const { mutate: mutateVote, isLoading: isLoadingVote } = useMutation({
    mutationFn: postVote,
    onSuccess: (succ: any) => {
      console.log({ data: succ });
      setModalQuery({
        ...modalQuery,
        visible: true,
        title: 'Berhasil',
        desc: {
          buttonCancel: 'OK',
          buttonDone: '',
          title: succ.message || 'Voting Anda berhasil disimpan.',
        },
        onDismiss: () => {
          setModalQuery((prev) => ({ ...prev, visible: false }));
          props.navigation.goBack();
        },
        onDone: () => {}, // Kosongkan karena buttonDone tidak dipakai di sukses
      });
    },
  });

  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    onDismiss: () => setModalQuery((prev) => ({ ...prev, visible: false })),
    onDone: () => {
      setModalQuery((prev) => ({ ...prev, visible: false }));
      mutateVote(voteData);
    },
    desc: {
      buttonCancel: 'Batal',
      buttonDone: 'Kirim',
      title: 'Apakah Anda yakin dengan pilihan ini?',
    },
  });

  // Trigger Modal saat opsi di-klik
  useEffect(() => {
    if (voteData?.id_pertanyaan && voteData.id_jawaban) {
      setModalQuery((prev) => ({
        ...prev,
        visible: true,
        title: 'Konfirmasi Voting',
        desc: {
          buttonCancel: 'Batal',
          buttonDone: 'Kirim',
          title: 'Apakah Anda yakin ingin mengirimkan voting ini?',
        },
        onDismiss: () => setModalQuery((prev) => ({ ...prev, visible: false })),
        onDone: () => {
          setModalQuery((prev) => ({ ...prev, visible: false }));
          mutateVote(voteData); // Panggil fungsi post saat user klik Kirim
        },
      }));
    }
  }, [voteData]);

  // Ekstrak data dengan aman
  const questionList = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const optionList = Array.isArray(detailDosen?.option) ? detailDosen.option : [];

  return (
    <View style={styles.container}>
      {/* Header UIKA Hijau */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (detailDosen?.pertanyaan?.deskripsi) {
              setStateVote('question');
              setDetailDosen(null);
            } else {
              props.navigation.goBack();
            }
          }}
          style={styles.backBtn}>
          <Icons name="arrow-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {detailDosen?.pertanyaan?.deskripsi ?? 'E-Voting TIAS'}
        </Text>
      </View>

      <View style={styles.bottomSheet}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Tampilkan Loading Spinner saat Fetching API */}
          {isLoading || isLoadingData || isLoadingVote ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#15613F" />
              <Text style={styles.loadingText}>Memuat data voting...</Text>
            </View>
          ) : (
            <>
              {/* KONDISI 1: TAMPILAN DAFTAR PERTANYAAN */}
              {stateVote === 'question' && (
                questionList.length > 0 ? (
                  questionList.map((list: any) => (
                    <TouchableOpacity
                      onPress={() => mutate(list.id)}
                      key={`list-${list.id}`}
                      style={styles.card}>
                      <View style={styles.iconBox}>
                        <Icons name="vote" size={24} color="#15613F" />
                      </View>
                      <Text style={styles.cardTitle}>{list.deskripsi}</Text>
                      <Icons name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.centerContainer}>
                    <Icons name="clipboard-text-off-outline" size={60} color="#D1D5DB" />
                    <Text style={styles.emptyText}>Tidak ada pertanyaan voting saat ini.</Text>
                  </View>
                )
              )}

              {/* KONDISI 2: TAMPILAN OPSI JAWABAN (DOSEN) */}
              {stateVote === 'vote' && (
                optionList.length > 0 ? (
                  optionList.map((list: any) => (
                    <TouchableOpacity
                      onPress={() => {
                        setVoteData({
                          id_pertanyaan: list.id_pertanyaan,
                          id_jawaban: list.id_jawaban,
                        });
                      }}
                      key={`list-dosen-${list.id}-${list.id_pertanyaan}`}
                      style={styles.optionCard}>
                      <View style={styles.radioCircle} />
                      <Text style={styles.optionText}>{list.jawaban}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.centerContainer}>
                    <Icons name="account-search-outline" size={60} color="#D1D5DB" />
                    <Text style={styles.emptyText}>Tidak ada opsi jawaban tersedia.</Text>
                  </View>
                )
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* Komponen Modal Konfirmasi */}
      <DialogComponent
        visible={modalQuery.visible}
        onDismiss={modalQuery.onDismiss}
        onDone={modalQuery.onDone}
        title={modalQuery.title}
        desc={modalQuery.desc}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15613F', // Hijau UIKA
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(8),
    paddingBottom: responsiveWidth(6),
    backgroundColor: '#15613F',
  },
  backBtn: {
    padding: 4,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#F4F4F9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingTop: responsiveWidth(8),
    paddingBottom: responsiveWidth(10),
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveWidth(20),
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: responsiveFontSize(1.8),
  },
  emptyText: {
    marginTop: 16,
    color: '#9CA3AF',
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconBox: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: responsiveFontSize(2),
    color: '#1F2937',
    fontWeight: 'bold',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(3),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: '#374151',
    fontWeight: '500',
  },
});

export default EvotingComp;