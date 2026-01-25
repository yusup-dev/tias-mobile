import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
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
  const {data, isLoading}: {data: any; isLoading: Boolean} = useQuery({
    queryKey: ['listQuestion', {}],
    queryFn: () => {
      return getVotingQuesting();
    },
    onSuccess: result => {
      console.log({result});
    },
    onError: result => {
      console.log({result});
    },
  });
  const [detailDosen, setDetailDosen] = useState<any>();
  const [stateVote, setStateVote] = useState<'question' | 'vote'>('question');
  const {mutate, isLoading: isLoadingData} = useMutation({
    mutationFn: getVotingDosen,
    onSuccess: (succ: any) => {
      setStateVote('vote');
      setDetailDosen(succ.data);
    },
  });
  const [voteData, setVoteData] = useState<any>();
  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    onDismiss: () => {
      setModalQuery({
        ...modalQuery,
        visible: false,
      });
    },
    desc: {
      buttonCancel: 'Cancel',
      buttonDone: 'Done',
      title: 'Are you sure?',
    },
  });
  const {mutate: mutateVote, isLoading: isLoadingVote} = useMutation({
    mutationFn: postVote,
    onSuccess: (succ: any) => {
      console.log({data: succ});
      setModalQuery({
        ...modalQuery,
        visible: true,
        title: '',
        onDismiss: () => {
          setModalQuery({
            ...modalQuery,
            visible: false,
          });
          props.navigation.goBack();
        },
        desc: {
          buttonCancel: 'OK',
          buttonDone: '',
          title: succ.message,
        },
      });
      //   props.navigation.goBack();
    },
  });
  useEffect(() => {
    if (voteData?.id_pertanyaan && voteData.id_jawaban) {
      setModalQuery({
        ...modalQuery,
        visible: true,
        title: '',
        desc: {
          buttonCancel: 'Cancel',
          buttonDone: 'Done',
          title: 'Are you sure?',
        },
      });
      //   mutateVote(voteData);
    }
  }, [voteData]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          paddingLeft: responsiveWidth(2),
          paddingVertical: responsiveWidth(4),
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 10,
          marginBottom: responsiveWidth(2),
        }}>
        <TouchableOpacity
          onPress={() => {
            if (detailDosen?.pertanyaan?.deskripsi) {
              setStateVote('question');
              setDetailDosen('');
            } else {
              props.navigation.goBack();
            }
          }}
          style={{
            justifyContent: 'center',
          }}>
          <Icons name="arrow-left" size={responsiveWidth(6)} />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            marginLeft: responsiveWidth(3),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(3),
              fontWeight: 'bold',
            }}>
            {detailDosen?.pertanyaan?.deskripsi ?? 'E-Voting TIAS'}
          </Text>
        </View>
      </View>
      <ScrollView>
        {stateVote === 'question' ? (
          <>
            {data?.data?.length ? (
              data.data.map((list: any) => (
                <TouchableOpacity
                  onPress={() => {
                    //   setDetailID(list.id);
                    mutate(list.id);
                  }}
                  key={`list-${list.id}`}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    marginVertical: responsiveWidth(1.5),
                    paddingVertical: responsiveWidth(5),
                    marginHorizontal: responsiveWidth(3),
                    borderRadius: responsiveWidth(4),
                    paddingHorizontal: responsiveWidth(4),
                    borderColor: '#E9E9E9',
                    borderWidth: 1,
                  }}>
                  <Icons
                    name="vote"
                    size={responsiveWidth(6)}
                    color={'#2196F3'}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: responsiveFontSize(2.5),
                      color: '#2196F3',
                      fontWeight: 'bold',
                      marginLeft: responsiveWidth(2),
                    }}>
                    {list.deskripsi}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        {stateVote === 'vote' ? (
          <>
            {detailDosen?.option?.length ? (
              detailDosen?.option?.map((list: any) => (
                <TouchableOpacity
                  onPress={() => {
                    setVoteData({
                      id_pertanyaan: list.id_pertanyaan,
                      id_jawaban: list.id_jawaban,
                    });
                  }}
                  key={`list-dosen-${list.id}-${list.id_pertanyaan}`}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    marginVertical: responsiveWidth(1.5),
                    paddingVertical: responsiveWidth(5),
                    marginHorizontal: responsiveWidth(3),
                    borderRadius: responsiveWidth(4),
                    paddingHorizontal: responsiveWidth(4),
                    borderColor: '#E9E9E9',
                    borderWidth: 1,
                  }}>
                  <Text>{list.jawaban}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </ScrollView>
      <DialogComponent
        visible={modalQuery.visible}
        // onDismiss={() => {
        //   setModalQuery({
        //     ...modalQuery,
        //     visible: !modalQuery.visible,
        //   });
        // }}
        onDismiss={modalQuery.onDismiss}
        onDone={() => {
          console.log('kesini');
          setModalQuery({
            ...modalQuery,
            visible: !modalQuery.visible,
          });
          mutateVote(voteData);
        }}
        title={modalQuery.title}
        desc={modalQuery.desc}
      />
    </View>
  );
};

export default EvotingComp;
