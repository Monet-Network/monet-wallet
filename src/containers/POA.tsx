import React from 'react';
import styled from 'styled-components';

import Utils from 'evm-lite-utils';

import { connect } from 'react-redux';
import { config, Spring } from 'react-spring/renderprops';
import { Header, Grid, Container, Card } from 'semantic-ui-react';

import { Store } from '../store';

import { POAState, reload } from '../modules/poa';

import Banner from '../components/Banner';
import Nominee from '../components/Nominee';
import Jumbo from '../components/Jumbo';
import FloatingButton from '../components/FloatingButton';
import LoadingButton from '../components/LoadingButton';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Status = styled.div`
	color: green !important;
`;

const Padding = styled.div`
	margin: 25px 20px;
	margin-bottom: 0 !important;
`;

const Whitelist = styled(Padding)`
	/* position: sticky; */
`;

const WhitelistItem = styled.div`
	padding: 15px;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.03) !important;
	background: #fff;
	border-bottom: 1px solid #eee;

	&:nth-child(2n) {
		border-bottom: none !important;
	}

	& h5 {
		margin-bottom: 0 !important;
	}

	& div {
		word-break: break-all !important;
	}
`;

interface StoreProps {
	poa: POAState;
}

interface DispatchProps {
	handlePOAReload: () => void;
}

interface OwnProps {}

interface State {}

type LocalProps = OwnProps & StoreProps & DispatchProps;

class Accounts extends React.Component<LocalProps, State> {
	public state = {};

	public componentDidMount() {
		this.props.handlePOAReload();
	}

	public render() {
		const { poa } = this.props;

		return (
			<React.Fragment>
				<Jumbo>
					<Spring
						from={{
							marginLeft: -50,
							opacity: 0
						}}
						to={{
							marginLeft: 0,
							opacity: 1
						}}
						config={config.wobbly}
					>
						{props => (
							<Header style={props} as="h2" floated="left">
								Proof of Authority
								<Header.Subheader>
									Create new and manage existing accounts
								</Header.Subheader>
							</Header>
						)}
					</Spring>
					<Header as="h2" floated="right">
						Status
						<Header.Subheader>
							<Status>Online</Status>
						</Header.Subheader>
					</Header>
					<Header as="h2" floated="right">
						Validators
						<Header.Subheader>3</Header.Subheader>
					</Header>
				</Jumbo>
				<Banner color="orange">
					All accounts listed here are read in locally from your
					keystore.
				</Banner>
				<Container fluid={true}>
					<Grid columns="equal">
						<Grid.Column width={10}>
							<Padding>
								<h2>Nominees</h2>
								<div>
									<Card.Group>
										{poa.nominees.map(nominee => (
											<Nominee
												key={nominee.address}
												moniker={nominee.moniker}
												address={nominee.address}
												upVotes={nominee.upVotes}
												downVotes={nominee.downVotes}
											/>
										))}
									</Card.Group>
									{!poa.nominees.length &&
										'No nominees found.'}
								</div>
							</Padding>
						</Grid.Column>
						<Grid.Column>
							<Whitelist>
								<h3>Whitelist</h3>
								<div>
									{poa.whitelist.map(item => (
										<WhitelistItem key={item.address}>
											<h5>{capitalize(item.moniker)}</h5>
											<div>
												{Utils.cleanAddress(
													item.address
												)}
											</div>
										</WhitelistItem>
									))}
									{!poa.whitelist.length &&
										'No whitelist entries found.'}
								</div>
							</Whitelist>
						</Grid.Column>
					</Grid>
				</Container>
				<FloatingButton bottomOffset={60}>
					<LoadingButton
						isLoading={
							poa.loading.whitelist || poa.loading.nomineelist
						}
						onClickHandler={this.props.handlePOAReload}
					/>
				</FloatingButton>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (store: Store): StoreProps => ({
	poa: store.poa
});

const mapsDispatchToProps = (dispatch: any): DispatchProps => ({
	handlePOAReload: () => dispatch(reload())
});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(Accounts);
